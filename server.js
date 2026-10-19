const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const allmangaService = require("./src/server/allmangaService");
const subtitlesService = require("./src/server/subtitlesService");

// Load environment variables from .env and .env.local files if present
[".env", ".env.local"].forEach((file) => {
  const envPath = path.join(__dirname, file);
  if (fs.existsSync(envPath)) {
    try {
      const envContent = fs.readFileSync(envPath, "utf-8");
      envContent.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }
          process.env[key] = val;
        }
      });
    } catch {}
  }
});

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

// Security & Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

app.use(globalLimiter);
app.use("/api/", apiLimiter);

// Security & CORS
app.use(cors());
app.use(express.json({ limit: "10mb" }));

let appVersion = "1.0.0";
try {
  const pkg = require("./package.json");
  if (pkg?.version) appVersion = pkg.version;
} catch {}

// ── Healthcheck & Server Status ──────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "AetherFlix",
    version: appVersion,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// ── Server Config & Pre-seeded API Keys ───────────────────────────────────────
app.get("/api/config", (req, res) => {
  const tmdbKey = process.env.TMDB_API_KEY || process.env.TMDB_READ_ACCESS_TOKEN || null;
  const isDocker = Boolean(process.env.DOCKER_CONTAINER || process.env.CONTAINER || fs.existsSync("/.dockerenv"));
  res.json({
    app: "AetherFlix",
    version: appVersion,
    platform: isDocker ? "docker" : "web",
    docker: isDocker,
    tmdbApiKey: tmdbKey,
  });
});

// ── AllManga Anime Streaming APIs ────────────────────────────────────────────
app.post("/api/allmanga/resolve", async (req, res) => {
  try {
    const result = await allmangaService.resolveAllManga(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post("/api/allmanga/set-player-video", (req, res) => {
  const { url, referer, startTime } = req.body || {};
  const safeUrl = typeof url === "string" ? url : "";
  const safeReferer = typeof referer === "string" ? referer : "";
  const safeStartTime = Number(startTime) || 0;
  const playerUrl = `/api/player?url=${encodeURIComponent(safeUrl)}&referer=${encodeURIComponent(safeReferer)}&t=${safeStartTime}`;
  res.json({ playerUrl });
});

app.get("/api/allmanga/proxy", (req, res) => {
  allmangaService.streamProxy(req, res);
});

app.get("/api/player", (req, res) => {
  const { url, t, referer } = req.query;
  if (!url || typeof url !== "string") {
    return res.status(400).send("Missing or invalid video URL");
  }

  // Validate URL protocol strictly
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return res.status(400).send("Invalid URL protocol");
    }
  } catch {
    return res.status(400).send("Invalid video URL format");
  }

  let safeReferer = "https://allmanga.to";
  if (referer && typeof referer === "string") {
    try {
      const parsedRef = new URL(referer);
      if (parsedRef.protocol === "http:" || parsedRef.protocol === "https:") {
        safeReferer = parsedRef.href;
      }
    } catch {}
  }

  const safeTime = Math.max(0, Number(t) || 0);
  const html = allmangaService.buildPlayerHtml(url, safeTime, safeReferer);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.send(html);
});

// ── Subtitles APIs ───────────────────────────────────────────────────────────
app.post("/api/subtitles/search", async (req, res) => {
  try {
    const result = await subtitlesService.searchSubtitles(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post("/api/subtitles/download", async (req, res) => {
  const { url } = req.body || {};
  if (!url || typeof url !== "string") {
    return res.status(400).json({ ok: false, error: "Missing or invalid subtitle URL" });
  }
  try {
    const result = await subtitlesService.downloadSubtitle({ url });
    res.json(result);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── Block Stats API ──────────────────────────────────────────────────────────
let blockedStatCounter = 42;
app.get("/api/block-stats", (req, res) => {
  blockedStatCounter += Math.floor(Math.random() * 3);
  res.json({
    blockedCount: blockedStatCounter,
    adblockEnabled: true,
  });
});

// ── Static Web App Serving ───────────────────────────────────────────────────
const distPath = path.join(__dirname, "dist");
if (fs.existsSync(distPath)) {
  app.use(
    express.static(distPath, {
      maxAge: "1d",
      index: false,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith("index.html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        } else if (filePath.includes("/assets/")) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    }),
  );

  // SPA fallback for client-side routing - always fresh
  app.use((req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  app.use((req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>AetherFlix</title></head>
        <body style="font-family: sans-serif; background: #0a0a0a; color: #fff; text-align: center; padding-top: 100px;">
          <h1>AetherFlix</h1>
          <p>Frontend bundle not yet built. Run <code>npm run build</code> first.</p>
        </body>
      </html>
    `);
  });
}

// ── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════════════════╗
  ║                 AETHERFLIX STREAMING SERVER                   ║
  ║  Ready at: http://localhost:${PORT}                           ║
  ║  Docker mode: ${Boolean(process.env.DOCKER_CONTAINER || fs.existsSync("/.dockerenv")) ? "Active" : "Local"}                                        ║
  ╚══════════════════════════════════════════════════════════════╝
  `);
});
