import { useState, useEffect, useRef } from "react";

// ── Image component that proxies through Electron main process ────────────────
// Fixes Codeberg (and other external) images being blocked by Electron's CSP.
// Falls back to direct <img src> when not running in Electron.
function ReleaseImage({ src, alt, style }) {
  const [resolvedSrc, setResolvedSrc] = useState(null);

  useEffect(() => {
    if (!src) return;
    if (window.electron?.fetchReleaseImage) {
      window.electron.fetchReleaseImage(src).then((dataUri) => {
        setResolvedSrc(dataUri || src); // null means blocked/failed → try direct
      });
    } else {
      setResolvedSrc(src);
    }
  }, [src]);

  if (!resolvedSrc) return null;
  return (
    <img
      src={resolvedSrc}
      alt={alt}
      style={style}
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}

// ── Inline markdown + GitHub formatter ──────────────────────────────
// Handles: ~~strike~~, **bold**, *italic*, _italic_, `code`,
//          ![img](url), [link](url), bare https:// URLs, @mentions
function inlineFormat(text) {
  const parts = [];
  const re =
    /(~~[^~]+~~|\*\*[^*]+\*\*|\*[^*\n]+\*|_[^_\n]+_|`[^`]+`|!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s<>"')]+|@[\w-]+)/g;
  let last = 0,
    m,
    k = 0;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last)
      parts.push(<span key={k++}>{text.slice(last, m.index)}</span>);
    const raw = m[0];

    if (raw.startsWith("~~")) {
      parts.push(
        <s key={k++} style={{ color: "var(--text3)" }}>
          {raw.slice(2, -2)}
        </s>,
      );
    } else if (raw.startsWith("**")) {
      parts.push(
        <strong key={k++} style={{ color: "var(--text)", fontWeight: 600 }}>
          {raw.slice(2, -2)}
        </strong>,
      );
    } else if (raw.startsWith("*") || raw.startsWith("_")) {
      parts.push(
        <em key={k++} style={{ color: "var(--text2)", fontStyle: "italic" }}>
          {raw.slice(1, -1)}
        </em>,
      );
    } else if (raw.startsWith("`")) {
      parts.push(
        <code
          key={k++}
          style={{
            fontSize: 11,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 3,
            padding: "1px 5px",
            fontFamily: "monospace",
            color: "var(--text)",
          }}
        >
          {raw.slice(1, -1)}
        </code>,
      );
    } else if (raw.startsWith("![")) {
      const mm = raw.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (mm) {
        parts.push(
          <ReleaseImage
            key={k++}
            src={mm[2]}
            alt={mm[1]}
            style={{
              maxWidth: "100%",
              verticalAlign: "middle",
              borderRadius: 6,
              border: "1px solid var(--border)",
            }}
          />,
        );
      }
    } else if (raw.startsWith("[")) {
      const mm = raw.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (mm) {
        parts.push(
          <a
            key={k++}
            href={mm[2]}
            onClick={(e) => {
              e.preventDefault();
              window.electron?.openExternal(mm[2]);
            }}
            style={{
              color: "var(--red)",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {mm[1]}
          </a>,
        );
      }
    } else if (raw.startsWith("@")) {
      const username = raw.slice(1);
      parts.push(
        <a
          key={k++}
          href={`https://github.com/${username}`}
          onClick={(e) => {
            e.preventDefault();
            window.electron?.openExternal(`https://github.com/${username}`);
          }}
          style={{
            color: "var(--red)",
            textDecoration: "none",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {raw}
        </a>,
      );
    } else if (raw.startsWith("http")) {
      // Shorten PR/issue URLs to "#41"
      let label = raw;
      try {
        const u = new URL(raw);
        const prMatch = u.pathname.match(/\/(pull|issues?)\/(\d+)$/);
        if (prMatch) label = `#${prMatch[2]}`;
        else label = u.hostname.replace(/^www\./, "") + u.pathname;
      } catch {}
      parts.push(
        <a
          key={k++}
          href={raw}
          onClick={(e) => {
            e.preventDefault();
            window.electron?.openExternal(raw);
          }}
          style={{
            color: "var(--red)",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "0.95em",
          }}
        >
          {label}
        </a>,
      );
    }

    last = m.index + raw.length;
  }
  if (last < text.length) parts.push(<span key={k++}>{text.slice(last)}</span>);
  return parts.length ? parts : text;
}

// ── Block-level markdown renderer ────────────────────────────────────────────
// Handles: # headings, --- hr, > blockquote, 1. numbered list,
//          - /* bullets, ![img](url), blank lines, paragraphs
function renderChangelog(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // h3 ###
    if (line.startsWith("### ")) {
      elements.push(
        <div
          key={key++}
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--text)",
            marginTop: 14,
            marginBottom: 4,
            letterSpacing: 0.3,
          }}
        >
          {inlineFormat(line.slice(4))}
        </div>,
      );
      continue;
    }

    // h2 ##
    if (line.startsWith("## ")) {
      elements.push(
        <div
          key={key++}
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--text)",
            marginTop: 16,
            marginBottom: 6,
            borderBottom: "1px solid var(--border)",
            paddingBottom: 4,
          }}
        >
          {inlineFormat(line.slice(3))}
        </div>,
      );
      continue;
    }

    // h1 #
    if (line.startsWith("# ")) {
      elements.push(
        <div
          key={key++}
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "var(--text)",
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          {inlineFormat(line.slice(2))}
        </div>,
      );
      continue;
    }

    // horizontal rule --- / *** / ___  (must come before bullet check)
    if (/^([-*_])\1{2,}\s*$/.test(line.trim())) {
      elements.push(
        <div
          key={key++}
          style={{
            borderBottom: "1px solid var(--border)",
            margin: "12px 0",
          }}
        />,
      );
      continue;
    }

    // blockquote > …
    if (line.startsWith("> ")) {
      elements.push(
        <div
          key={key++}
          style={{
            borderLeft: "3px solid var(--red)",
            paddingLeft: 10,
            margin: "4px 0",
            color: "var(--text3)",
            fontSize: 13,
            fontStyle: "italic",
            lineHeight: 1.6,
          }}
        >
          {inlineFormat(line.slice(2))}
        </div>,
      );
      continue;
    }

    // HTML img tag: <img ... src="..." ... alt="..." ...>
    const htmlImgMatch = line.match(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/i);
    if (htmlImgMatch) {
      const src = htmlImgMatch[1];
      const altMatch = line.match(/\balt="([^"]*)"/i);
      const alt = altMatch ? altMatch[1] : "";
      elements.push(
        <div key={key++} style={{ margin: "10px 0" }}>
          <ReleaseImage
            src={src}
            alt={alt}
            style={{
              maxWidth: "100%",
              borderRadius: 8,
              border: "1px solid var(--border)",
              display: "block",
            }}
          />
          {alt && (
            <div
              style={{
                fontSize: 11,
                color: "var(--text3)",
                textAlign: "center",
                marginTop: 4,
                fontStyle: "italic",
              }}
            >
              {alt}
            </div>
          )}
        </div>,
      );
      continue;
    }

    // standalone markdown image ![alt](url)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      const [, alt, src] = imgMatch;
      elements.push(
        <div key={key++} style={{ margin: "10px 0" }}>
          <img
            src={src}
            alt={alt}
            style={{
              maxWidth: "100%",
              borderRadius: 8,
              border: "1px solid var(--border)",
              display: "block",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          {alt && (
            <div
              style={{
                fontSize: 11,
                color: "var(--text3)",
                textAlign: "center",
                marginTop: 4,
                fontStyle: "italic",
              }}
            >
              {alt}
            </div>
          )}
        </div>,
      );
      continue;
    }

    // numbered list  1. …
    const numMatch = line.match(/^(\d+)\. (.*)$/);
    if (numMatch) {
      elements.push(
        <div
          key={key++}
          style={{
            display: "flex",
            gap: 8,
            fontSize: 13,
            color: "var(--text2)",
            lineHeight: 1.6,
            marginBottom: 2,
          }}
        >
          <span
            style={{
              color: "var(--red)",
              flexShrink: 0,
              fontWeight: 600,
              minWidth: 18,
              textAlign: "right",
            }}
          >
            {numMatch[1]}.
          </span>
          <span>{inlineFormat(numMatch[2])}</span>
        </div>,
      );
      continue;
    }

    // unordered bullet - or *
    if (/^[-*] /.test(line)) {
      elements.push(
        <div
          key={key++}
          style={{
            display: "flex",
            gap: 8,
            fontSize: 13,
            color: "var(--text2)",
            lineHeight: 1.6,
            marginBottom: 2,
          }}
        >
          <span style={{ color: "var(--red)", flexShrink: 0, marginTop: 1 }}>
            •
          </span>
          <span>{inlineFormat(line.slice(2))}</span>
        </div>,
      );
      continue;
    }

    // blank line
    if (line.trim() === "") {
      elements.push(<div key={key++} style={{ height: 6 }} />);
      continue;
    }

    // normal paragraph
    elements.push(
      <div
        key={key++}
        style={{
          fontSize: 13,
          color: "var(--text2)",
          lineHeight: 1.6,
          marginBottom: 2,
        }}
      >
        {inlineFormat(line)}
      </div>,
    );
  }
  return elements;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function UpdateModal({
  updateInfo,
  activeDownloads = 0,
  onClose,
}) {
  const {
    latest,
    current,
    url,
    changelog,
    assets = {},
    assetList = [],
    sourceLabel,
    releaseName,
    runningMode: initialMode,
    hasUpdate = true,
  } = updateInfo;

  const [phase, setPhase] = useState("idle"); // idle | downloading | installing | done | error
  const [format, setFormat] = useState(initialMode || null); // "docker" | "apk" | "wgt" | "web" | "dmg" | "exe" | etc.
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedDocker, setCopiedDocker] = useState(false);
  const cancelRef = useRef(false);

  // Detect install format on mount
  useEffect(() => {
    if (!window.electron?.detectUpdateFormat) return;
    let mounted = true;
    window.electron.detectUpdateFormat().then((fmt) => {
      if (mounted && fmt) setFormat(fmt);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Listen for download progress from main process
  useEffect(() => {
    if (!window.electron?.onUpdateProgress) return;
    const handler = window.electron.onUpdateProgress((data) => {
      setProgress(data.percent ?? 0);
      setProgressLabel(data.label ?? "");
    });
    return () => window.electron.offUpdateProgress(handler);
  }, []);

  const isDocker = format === "docker";
  const isAndroid = format === "apk" || (!format && Boolean(assets?.apk));
  const isTizen = format === "wgt" || (!format && Boolean(assets?.wgt));
  const isWeb = format === "web";
  const isDesktop = ["dmg", "exe", "appimage", "deb", "pacman"].includes(format);

  const assetUrl = format && assets?.[format];
  const canInstall =
    isDesktop && assetUrl && activeDownloads === 0 && phase === "idle";

  const handleInstall = async () => {
    if (!canInstall) return;
    cancelRef.current = false;
    setPhase("downloading");
    setProgress(0);
    setProgressLabel("Preparing…");

    try {
      const result = await window.electron.downloadAndInstallUpdate({
        url: assetUrl,
        format,
      });
      if (cancelRef.current) return;
      if (!result.ok) throw new Error(result.error || "Update failed");
      setPhase("installing");
      setProgressLabel("Launching installer…");
    } catch (e) {
      if (cancelRef.current) return;
      setPhase("error");
      setErrorMsg(e.message || "Update failed");
    }
  };

  const handleCancel = () => {
    if (phase === "downloading") {
      cancelRef.current = true;
      window.electron?.cancelUpdate?.();
    }
    onClose();
  };

  const copyDockerCmd = (e) => {
    e?.stopPropagation();
    navigator.clipboard?.writeText("docker compose pull && docker compose up -d");
    setCopiedDocker(true);
    setTimeout(() => setCopiedDocker(false), 2000);
  };

  const formatLabel =
    {
      docker: "Docker Container",
      apk: "Android TV / Fire TV",
      wgt: "Samsung Smart TV (Tizen)",
      web: "Web Platform",
      appimage: "AppImage (Linux)",
      deb: ".deb package (Debian/Ubuntu)",
      pacman: ".pacman (Arch Linux)",
      exe: "Windows installer",
      dmg: "macOS installer (Universal)",
    }[format] || (format ? String(format).toUpperCase() : "Release Package");

  const busy = phase === "downloading" || phase === "installing";

  return (
    <div
      onClick={busy ? undefined : handleCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 6000,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        cursor: busy ? "default" : "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          width: "100%",
          maxWidth: 640,
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 40px rgba(229,9,20,0.15)",
          overflow: "hidden",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            padding: "22px 28px 16px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 20 }}>
                  {isDocker ? "🐳" : isAndroid || isTizen ? "📺" : "🚀"}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    letterSpacing: 0.5,
                    color: "var(--text)",
                  }}
                >
                  {hasUpdate ? "UPDATE AVAILABLE" : "RELEASE DETAILS"}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: isDocker ? "#93c5fd" : isAndroid ? "#6ee7b7" : isTizen ? "#c4b5fd" : "var(--red)",
                    background: isDocker ? "rgba(59,130,246,0.15)" : isAndroid ? "rgba(52,211,153,0.15)" : isTizen ? "rgba(192,132,252,0.15)" : "var(--red-dim)",
                    border: `1px solid ${isDocker ? "rgba(59,130,246,0.3)" : isAndroid ? "rgba(52,211,153,0.3)" : isTizen ? "rgba(192,132,252,0.3)" : "rgba(229,9,20,0.3)"}`,
                    borderRadius: "var(--radius-pill)",
                    padding: "2px 10px",
                  }}
                >
                  {formatLabel}
                </span>
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text2)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {current && (
                  <>
                    <span>Current: <strong>v{current}</strong></span>
                    <span style={{ color: "var(--text3)" }}>→</span>
                  </>
                )}
                <a
                  href={url}
                  onClick={(e) => {
                    e.preventDefault();
                    window.electron?.openExternal(url);
                  }}
                  style={{
                    color: "var(--red)",
                    fontWeight: 700,
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                  title={`View on ${sourceLabel || "GitHub"}`}
                >
                  v{latest} ({releaseName || "Latest"}) ↗
                </a>
              </div>
            </div>
            <button
              onClick={handleCancel}
              disabled={busy}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text3)",
                cursor: busy ? "not-allowed" : "pointer",
                fontSize: 18,
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                opacity: busy ? 0.35 : 1,
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* ── Environment-Specific Quick Action Card ── */}
        <div style={{ padding: "18px 28px 0" }}>
          {isDocker && (
            <div
              style={{
                background: "rgba(37,99,235,0.08)",
                border: "1px solid rgba(59,130,246,0.25)",
                borderRadius: 12,
                padding: "14px 18px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <strong style={{ fontSize: 13, color: "#93c5fd", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>🐳</span> Update Docker Container:
                </strong>
                <button
                  onClick={copyDockerCmd}
                  className="btn btn-ghost"
                  style={{
                    padding: "4px 12px",
                    fontSize: 12,
                    background: copiedDocker ? "#10b981" : "rgba(255,255,255,0.08)",
                    color: "#fff",
                    borderColor: copiedDocker ? "#10b981" : "rgba(255,255,255,0.15)",
                  }}
                >
                  {copiedDocker ? "✓ Copied!" : "📋 Copy Command"}
                </button>
              </div>
              <code
                style={{
                  display: "block",
                  background: "rgba(0,0,0,0.5)",
                  padding: "10px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#e2e8f0",
                  fontFamily: "monospace",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                docker compose pull && docker compose up -d
              </code>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 8 }}>
                Or rebuild locally with: <code>docker compose up --build -d</code>
              </div>
            </div>
          )}

          {isAndroid && (
            <div
              style={{
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.25)",
                borderRadius: 12,
                padding: "14px 18px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <strong style={{ fontSize: 13, color: "#6ee7b7", display: "block" }}>
                    📺 Android TV / Fire TV / Google TV APK
                  </strong>
                  <span style={{ fontSize: 12, color: "var(--text2)" }}>
                    Download the signed release APK directly for TV sideloading.
                  </span>
                </div>
                {assets?.apk && (
                  <a
                    href={assets.apk}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ textDecoration: "none", flexShrink: 0 }}
                  >
                    ⬇ Download APK
                  </a>
                )}
              </div>
            </div>
          )}

          {isTizen && (
            <div
              style={{
                background: "rgba(139,92,246,0.08)",
                border: "1px solid rgba(139,92,246,0.25)",
                borderRadius: 12,
                padding: "14px 18px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <strong style={{ fontSize: 13, color: "#c4b5fd", display: "block" }}>
                    📺 Samsung Smart TV (Tizen OS Widget)
                  </strong>
                  <span style={{ fontSize: 12, color: "var(--text2)" }}>
                    Sideload to Samsung Smart Hub via <code>sdb install AetherFlix.wgt</code>
                  </span>
                </div>
                {assets?.wgt && (
                  <a
                    href={assets.wgt}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ textDecoration: "none", flexShrink: 0 }}
                  >
                    ⬇ Download .wgt
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Downloadable Packages from Release ── */}
        {assetList && assetList.length > 0 && (
          <div style={{ padding: "16px 28px 0" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.2,
                color: "var(--text3)",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Release Packages ({assetList.length})
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
                gap: 8,
              }}
            >
              {assetList.map((ast) => (
                <a
                  key={ast.name}
                  href={ast.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--text)",
                    textDecoration: "none",
                    fontSize: 13,
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--red)";
                    e.currentTarget.style.background = "var(--surface3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.background = "var(--surface2)";
                  }}
                >
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    📦 {ast.name}
                  </span>
                  {ast.sizeMb && (
                    <span style={{ fontSize: 11, color: "var(--text3)", marginLeft: 6 }}>
                      {ast.sizeMb}MB
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Changelog ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 28px" }}>
          {changelog ? (
            <>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  color: "var(--text3)",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                What's New in this Release
              </div>
              <div>{renderChangelog(changelog)}</div>
            </>
          ) : (
            <div
              style={{
                fontSize: 13,
                color: "var(--text3)",
                fontStyle: "italic",
              }}
            >
              No changelog provided for this release.
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            padding: "16px 28px",
            borderTop: "1px solid var(--border)",
            flexShrink: 0,
            background: "rgba(0,0,0,0.2)",
          }}
        >
          {/* Active downloads warning */}
          {activeDownloads > 0 && phase === "idle" && (
            <div
              style={{
                fontSize: 12,
                color: "var(--red)",
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ⚠ {activeDownloads} download{activeDownloads > 1 ? "s" : ""}{" "}
              running, finish or cancel them before updating.
            </div>
          )}

          {/* Progress bar */}
          {(phase === "downloading" || phase === "installing") && (
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: "var(--text3)",
                  marginBottom: 6,
                }}
              >
                <span>
                  {progressLabel ||
                    (phase === "downloading"
                      ? "Downloading update…"
                      : "Installing…")}
                </span>
                {phase === "downloading" && (
                  <span>{Math.round(progress)}%</span>
                )}
              </div>
              <div
                style={{
                  height: 4,
                  background: "var(--surface2)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: phase === "installing" ? "100%" : `${progress}%`,
                    background: "var(--red)",
                    borderRadius: 2,
                    transition: "width 0.3s ease",
                    animation:
                      phase === "installing"
                        ? "progress-indeterminate 1.2s ease-in-out infinite"
                        : "none",
                  }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {phase === "error" && (
            <div
              style={{ fontSize: 13, color: "var(--red)", marginBottom: 12 }}
            >
              ✕ {errorMsg}
              <span style={{ marginLeft: 10 }}>
                <a
                  href={url}
                  onClick={(e) => {
                    e.preventDefault();
                    window.electron?.openExternal(url);
                  }}
                  style={{
                    color: "var(--red)",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Download manually ↗
                </a>
              </span>
            </div>
          )}

          {/* Done */}
          {phase === "done" && (
            <div style={{ fontSize: 13, color: "#48c774", marginBottom: 12 }}>
              ✓ Update downloaded, installer is running
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn btn-ghost" onClick={handleCancel}>
              {phase === "downloading" ? "Cancel" : "Close"}
            </button>
            {phase === "idle" && (
              <>
                <a
                  href={url}
                  onClick={(e) => {
                    e.preventDefault();
                    window.electron?.openExternal(url);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "9px 18px",
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text)",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  View on {sourceLabel || "GitHub"} ↗
                </a>
                {canInstall && (
                  <button
                    className="btn btn-primary"
                    onClick={handleInstall}
                    style={{ fontWeight: 600 }}
                  >
                    Install Update
                  </button>
                )}
                {isAndroid && assets?.apk && (
                  <a
                    href={assets.apk}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ textDecoration: "none", fontWeight: 600 }}
                  >
                    ⬇ Download APK
                  </a>
                )}
                {isTizen && assets?.wgt && (
                  <a
                    href={assets.wgt}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ textDecoration: "none", fontWeight: 600 }}
                  >
                    ⬇ Download .wgt
                  </a>
                )}
                {isDocker && (
                  <button
                    className="btn btn-primary"
                    onClick={copyDockerCmd}
                    style={{ fontWeight: 600 }}
                  >
                    {copiedDocker ? "✓ Copied Docker Command!" : "📋 Copy Docker Command"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress-indeterminate {
          0%   { transform: translateX(-100%); width: 60%; }
          100% { transform: translateX(200%);  width: 60%; }
        }
      `}</style>
    </div>
  );
}
