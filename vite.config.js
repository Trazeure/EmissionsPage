import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,     // Añadido para permitir acceso desde la red
    port: 3000      // Tu puerto actual
  },
  resolve: {
    alias: {
      '@': '/src',  // Manteniendo tu alias actual
    },
  }
})