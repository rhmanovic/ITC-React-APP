import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer'; // For bundle analysis
import viteCompression from 'vite-plugin-compression'; // For GZIP/Brotli compression

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }), // Generates a bundle analysis report
    viteCompression({ algorithm: 'brotliCompress' }) // Compresses assets
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  build: {
    minify: 'esbuild', // Faster and smaller minification
    sourcemap: false,  // Disable sourcemaps in production
    chunkSizeWarningLimit: 500, // Increase warning limit for large chunks
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Split vendor code into a separate bundle
          }
        },
      },
    },
  },
});
