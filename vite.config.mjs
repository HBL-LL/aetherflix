import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isDist = process.env.ELECTRON_DIST === "1";
  return {
    plugins: [react()],
    base: "./",
    build: {
      emptyOutDir: false,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: isDist,
          drop_debugger: isDist,
        },
      },
      rollupOptions: {
        output: {
          // Vite 8 (Rolldown) only accepts the function form
          manualChunks(id) {
            if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return "react";
            if (id.includes("/src/pages/SettingsPage")) return "settings";
            if (id.includes("/src/pages/MoviePage")) return "movie";
            if (id.includes("/src/pages/TVPage")) return "tv";
            if (id.includes("/src/pages/DownloadsPage")) return "downloads";
          },
        },
      },
    },
  };
});
