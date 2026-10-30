# Changelog

All notable changes to the **Streambert Web & Docker Edition** fork.

## [1.1.0] - 2026-10-30

### Rebrand
- New AetherFlix logo (an A tipped onto its side becomes the play button) and wordmark across desktop, web, Docker, Android TV and Tizen.
- Android launcher, adaptive and splash icons are now branded instead of Capacitor's placeholder.
- Accent colour moves to Projector Red `#dd3324`.
- Remaining user-facing "Streambert" text replaced: Windows uninstaller, Linux desktop entry, one-click launchers, titlebar and download logs.

### Home screen
- New screening-window layout: blurred ambient backdrop that follows the focused title, glass panel, rounded hero card, wide 16:9 rows and a Top 10 row.
- Sidebar becomes a floating navigation capsule.

### Fixes
- Release links, the update checker and the updater's trusted download path now point at the `HBL-LL/aetherflix` repository.
- Android TV and Tizen builds report their real version to the update checker instead of a hard-coded 1.0.0.

## [3.0.0-web] - 2026-10-17

### 🚀 Major Enhancements: Converted Desktop App to Web App & Docker

This release converts Streambert from an Electron desktop app into a self-hosted, containerized web application that runs in any standard web browser or inside Docker.

### 🌐 Web Adaptation & Architecture
- **Browser WebAdapter (`src/utils/webAdapter.js`)**: Polyfilled the Electron IPC bridge for standard web browsers, supporting secure token storage via `localStorage`, browser-native notifications via the Web Notification API, external link handling, and HTML5 Fullscreen.
- **Iframe Player Migration (`src/pages/MoviePage.jsx`, `src/pages/TVPage.jsx`, `src/components/TrailerModal.jsx`)**: Replaced Electron-only `<webview>` tags with standard `<iframe>` elements.
- **Sandbox Fix**: Removed the `sandbox` attribute from player `<iframe>` elements to prevent providers (Videasy, VidSrc, VidKing) from blocking playback with "Iframe Sandbox Detected" errors.
- **Navigation & UI**: Replaced the desktop "Quit App" button with an HTML5 Fullscreen toggle and hidden Windows titlebar buttons in web mode.
- **External Links**: Made all documentation and external links open safely in new tabs via `target="_blank" rel="noopener noreferrer"`.

### 🖥️ Backend Web Server
- **Express Server (`server.js`)**: Added a high-performance backend serving the compiled Vite React frontend with Single Page Application (SPA) routing.
- **Anime Resolver & Streaming Proxy (`src/server/allmangaService.js`)**: Extracted AllManga and AniList episode resolution logic into a standalone service. Provides an HTTP Range (206 Partial Content) proxy for streaming media with CORS headers and custom HTML5 video player with HLS.js support.
- **Subtitle Service (`src/server/subtitlesService.js`)**: Added subtitle search endpoints supporting Wyzie and SubDL APIs, along with server-side ZIP extraction for subtitle files.
- **API Endpoints**:
  - `GET /api/health`: Healthcheck endpoint for Docker and monitoring.
  - `GET /api/config`: Exposes server configuration and supports auto-populating TMDB API key from environment variables.
  - `GET /api/block-stats`: Ad-blocking statistics.

### 🐳 Docker & Containerization
- **Multi-Stage `Dockerfile`**: Production-ready image using `node:22-alpine` with build caching and non-root user execution (`node`).
- **`docker-compose.yml`**: One-command setup (`docker compose up -d`) with:
  - Port mapping: `3000:3000`
  - Health checks: `http://127.0.0.1:3000/api/health`
  - Volume mounting for downloads: `./downloads:/app/downloads`
  - Optional `TMDB_API_KEY` environment variable to skip manual token entry on startup.
- **`.dockerignore`**: Excluded `node_modules`, build artifacts, and desktop binaries from Docker build context.
