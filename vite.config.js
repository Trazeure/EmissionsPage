import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/EmissionsPage/',  // Configuración añadida para desplegar en GitHub Pages
  plugins: [react()],
  server: {
    host: true,     // Permite acceso desde la red local
    port: 3000      // Tu puerto actual
  },
  resolve: {
    alias: {
      '@': '/src',  // Alias para tu estructura de archivos
    },
  }
})
