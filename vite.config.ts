import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: "./static",
  base: "./",
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
      // /api/yr?lat=41.33&lon=19.83  →  https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=41.33&lon=19.83
      "/api/yr": {
        target: "https://api.met.no",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/api\/yr/, "/weatherapi/locationforecast/2.0/compact"),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            // MET Norway requires a descriptive User-Agent — without it requests are rejected
            proxyReq.setHeader("User-Agent", "Moti.com.al contact@moti.com.al");
            proxyReq.setHeader("Accept-Encoding", "gzip, deflate");
          });
        },
      },
      // MetAlerts live warnings proxy
      // https://api.met.no/weatherapi/metalerts/2.0/current.json?lat=&lon=
      "/api/metalerts": {
        target: "https://api.met.no",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/api\/metalerts/, "/weatherapi/metalerts/2.0/current.json"),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("User-Agent", "Moti.com.al contact@moti.com.al");
            proxyReq.setHeader("Accept-Encoding", "gzip, deflate");
          });
        },
      },
    },
  },
});
