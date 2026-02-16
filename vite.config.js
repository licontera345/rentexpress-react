// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      // En desarrollo, las peticiones a /rentexpress-rest-api se reenvían al backend.
      // Así se evita CORS y el 404/CORS se debe resolver en el backend.
      '/rentexpress-rest-api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
})
