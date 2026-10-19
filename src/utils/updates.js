// ── App Update Utilities ──────────────────────────────────────────────────────
// Centralised update-check logic. Imported by both App.jsx and SettingsPage.jsx.
//
// Supports multiple release sources (GitHub + Codeberg).

export const GITHUB_REPO = "Hamza-Boulila/aetherflix";

// ── Source registry ───────────────────────────────────────────────────────────
// Each entry describes where to fetch from and how to build the
// "view release" URL.
export const UPDATE_SOURCES = {
  github: {
    id: "github",
    label: "GitHub",
    apiUrl: `https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=10`,
    headers: { Accept: "application/vnd.github+json" },
    fallbackUrl: `https://github.com/${GITHUB_REPO}/releases/latest`,
  },
};

export const DEFAULT_UPDATE_SOURCE = "github";

// Normalise "v1.3.0 (Web)" or "1.3" → [1, 3, 0] so semver comparison works correctly
export function normaliseVersion(v) {
  if (!v) return [0, 0, 0];
  const clean = String(v).replace(/^v/i, "").trim().split(/[\s(-]/)[0];
  const parts = clean.split(".");
  while (parts.length < 3) parts.push("0");
  return parts.slice(0, 3).map((n) => {
    const num = parseInt(n, 10);
    return isNaN(num) ? 0 : num;
  });
}

// Returns true only when `a` is strictly greater than `b` (semver arrays)
export function semverGt(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] > b[i]) return true;
    if (a[i] < b[i]) return false;
  }
  return false;
}

// Fetch current app version fresh each time, avoids race condition
async function getCurrentVersion() {
  if (typeof window !== "undefined" && window.electron?.getAppVersion) {
    return window.electron.getAppVersion();
  }
  return "1.0.0";
}

/**
 * Check for updates against a given source ("github" | "codeberg").
 * Extracts release info, assets for all platforms (TV APK, Tizen WGT, Desktop, Docker),
 * and accurately compares versions.
 */
export async function checkForUpdates(source = DEFAULT_UPDATE_SOURCE) {
  const cfg = UPDATE_SOURCES[source];
  if (!cfg) throw new Error(`Unknown update source: ${source}`);

  const currentVersion = await getCurrentVersion();

  let runningMode = "web";
  if (typeof window !== "undefined" && window.electron?.detectUpdateFormat) {
    try {
      runningMode = (await window.electron.detectUpdateFormat()) || "web";
    } catch {}
  }

  const res = await fetch(cfg.apiUrl, {
    headers: cfg.headers,
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`${cfg.label} API error ${res.status}`);
  const releases = await res.json();

  // Skip pre-releases and drafts, only consider stable published releases
  const data = Array.isArray(releases)
    ? releases.find((r) => !r.prerelease && !r.draft) || releases[0]
    : null;
  if (!data) throw new Error(`No release found on ${cfg.label}`);

  const latestRaw = (data.tag_name || "").replace(/^v/i, "");
  const latestParts = normaliseVersion(latestRaw);
  const currentParts = normaliseVersion(currentVersion);
  const url = data.html_url || cfg.fallbackUrl;

  // Map release assets to install formats and collect all downloadable assets.
  const assets = {};
  const assetList = [];
  for (const asset of data.assets || []) {
    const name = (asset.name || "").toLowerCase();
    const downloadUrl = asset.browser_download_url;
    const sizeMb = asset.size ? (asset.size / (1024 * 1024)).toFixed(1) : null;
    assetList.push({
      name: asset.name,
      url: downloadUrl,
      sizeMb,
      downloadCount: asset.download_count || 0,
      contentType: asset.content_type || "",
    });

    if (name.endsWith(".appimage")) assets.appimage = downloadUrl;
    else if (name.endsWith(".deb")) assets.deb = downloadUrl;
    else if (name.endsWith(".exe")) assets.exe = downloadUrl;
    else if (name.endsWith(".pacman")) assets.pacman = downloadUrl;
    else if (name.endsWith(".dmg")) assets.dmg = downloadUrl;
    else if (name.endsWith(".apk")) assets.apk = downloadUrl;
    else if (name.endsWith(".wgt")) assets.wgt = downloadUrl;
    else if (name.endsWith(".zip") || name.endsWith(".tar.gz")) assets.archive = downloadUrl;
  }

  return {
    source: cfg.id,
    sourceLabel: cfg.label,
    latest: latestRaw || currentVersion,
    current: currentVersion,
    releaseName: data.name || data.tag_name || `v${latestRaw}`,
    publishedAt: data.published_at || null,
    runningMode,
    url,
    changelog: data.body || "",
    assets,
    assetList,
    hasUpdate: latestRaw !== "" && semverGt(latestParts, currentParts),
  };
}

/**
 * Like checkForUpdates(), but if the chosen source fails (network error,
 * repo gone, API down) it automatically retries with the other source.
 * The result includes `usedFallback: true` when that happened so the UI
 * can optionally show a notice.
 */
export async function checkForUpdatesWithFallback(
  source = DEFAULT_UPDATE_SOURCE,
) {
  try {
    const result = await checkForUpdates(source);
    return { ...result, usedFallback: false };
  } catch (primaryErr) {
    // Try every other source in order
    const fallbacks = Object.keys(UPDATE_SOURCES).filter((s) => s !== source);
    for (const fallback of fallbacks) {
      try {
        const result = await checkForUpdates(fallback);
        return { ...result, usedFallback: true, fallbackFrom: source };
      } catch {
        // continue to next fallback
      }
    }
    // All sources failed
    throw primaryErr;
  }
}
