import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Path dasar diatur sesuai dengan nama repositori GitHub Anda.
  // Ini sangat penting agar GitHub Pages dapat menemukan aset Anda dengan benar.
  base: '/warung-isekai/',
})
