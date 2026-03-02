import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: true,
    proxy: {
      '/rentexpress-rest-api/api': {
        target: process.env.VITE_PROXY_TARGET || 'http://94.130.104.92:8081',
        changeOrigin: true,
      },
    },
  },
});
