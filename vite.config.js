import { fileURLToPath, URL } from "node:url";
import { SERVER_URL } from "./src/globals.js"

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  switch(command) {
    case "build":
      return {
        base: "/",
        plugins: [vue()],
        resolve: {
          alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
          },
        }
      }
    case "serve":
      return {
        base: "/",
        plugins: [vue()],
        resolve: {
          alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
          },
        },
        server: {
          proxy: {
            "/api": {
              target: SERVER_URL,
              changeOrigin: true,
              secure: false,
              rewrite: (path) => path.replace(/^\/api/, ""),
            },
          },
        },

      }
  }
});
