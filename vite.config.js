import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.VITE_BASE || "/",

  root: "public",

  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },

  server: {
    port: 3000,
    open: true,
    cors: true,
  },

  preview: {
    port: 4173,
  },
});
