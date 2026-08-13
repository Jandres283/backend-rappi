import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  build: {
    cssMinify: 'esbuild',
  },
  server: {
    port: 5173,
    proxy: {
      // Solo dejamos el proxy de las peticiones a la API
      '/api': {
        target: 'http://localhost:3977',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});