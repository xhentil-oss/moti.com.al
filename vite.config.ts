import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: "./static",
  // Rrugë absolute — faqja shërbehet nga rrënja e domain-it (moti.com.al).
  // Me "./" (relative), asetet prishen te rrugët me disa segmente pas SPA-fallback.
  base: "/",
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      // Në zhvillim, të gjitha thirrjet /api i drejtojmë te backend-i lokal Express.
      // Backend-i menaxhon: /api/locations, /api/auth, /api/weather, /api/metalerts, /api/health.
      // Nise backend-in me:  cd server && npm run dev
      "/api": {
        target: process.env.VITE_API_TARGET || "http://127.0.0.1:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
