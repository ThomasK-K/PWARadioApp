import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import fs from "node:fs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,mp3}"],
        // Ensure the service worker can work on any URL
        navigateFallback: "index.html",
        // Make service worker work with different origins
        navigateFallbackAllowlist: [/^\/$/],
      },
      injectRegister: "script",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        scope: "/",
        start_url: "/",
        name: "RadioStreaming PWA",
        short_name: "RadioStreaming",
        description: "Eine einfache Radio Streaming Progressive Web App",
        theme_color: "#000000",
        background_color: "#ffffff",
        lang: "de",
        dir: "ltr",
        display: "standalone",

        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  // Source map configuration
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        sourcemapExcludeSources: false,
        // Make source maps more reliable
        sourcemapPathTransform: (relativeSourcePath) => {
          return relativeSourcePath.replace(/^\.\.\//, "");
        },
      },
    },
  },
  // Improve development source maps
  server: {
    sourcemapIgnoreList: false,
    https: (() => {
      // Check for environment variables first (highest priority)
      if (process.env.SSL_CRT_FILE && process.env.SSL_KEY_FILE) {
        console.log('Using SSL certificates from environment variables');
        try {
          return {
            cert: fs.readFileSync(process.env.SSL_CRT_FILE),
            key: fs.readFileSync(process.env.SSL_KEY_FILE),
          };
        } catch (e) {
          console.warn('Error reading SSL certificates from environment variables:', e);
        }
      }

      // Then check for SSL folder (second priority)
      try {
        if (fs.existsSync("./ssl/radioapp.crt") && fs.existsSync("./ssl/radioapp.key")) {
          console.log('Using SSL certificates from ./ssl folder');
          return {
            cert: fs.readFileSync("./ssl/radioapp.crt"),
            key: fs.readFileSync("./ssl/radioapp.key"),
          };
        }
      } catch (e) {
        console.warn('Error reading SSL certificates from ./ssl folder:', e);
      }

      // Finally check for certs folder (fallback)
      try {
        if (fs.existsSync("./certs/radioapp.pem")) {
          console.log('Using SSL certificates from PEM file');
          return {
            key: fs.readFileSync("./certs/radioapp.pem"),
            cert: fs.readFileSync("./certs/radioapp.pem"),
          };
        }
      } catch (e) {
        console.warn('Error reading SSL certificates from PEM file:', e);
      }

      console.warn('SSL certificates not found, HTTPS will not be enabled in dev mode');
      return undefined;
    })(),
    port: 3000,
    host: true,
  },
});
