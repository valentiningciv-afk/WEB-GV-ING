import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Rutas relativas: la app no usa client-side routing, así que sirve igual
  // en la raíz (dev) o en un subdirectorio (GitHub Pages: /WEB-GV-ING/).
  base: './',
  plugins: [react(), tailwindcss()],
})
