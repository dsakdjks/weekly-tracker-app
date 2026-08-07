import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.VITE_BASE || "/",

  root: "public",
  publicDir: ".",

  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: "terser",
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.info", "console.debug"],
      },
      mangle: true,
      format: {
        comments: false,
      },
    },

    rollupOptions: {
      output: {
        // Optimize chunking strategy
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('/modules/')) {
            return 'modules';
          }
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },

    // CSS optimization
    cssCodeSplit: true,
    cssMinify: true,
  },

  server: {
    port: 3000,
    open: true,
    cors: true,
    middlewareMode: false,
  },

  preview: {
    port: 4173,
  },
});
