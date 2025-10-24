import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Ganti '<REPO_NAME>' dengan nama repositori GitHub Anda.
  // Contoh: jika URL repo Anda adalah github.com/user/my-anime-app,
  // maka base harusnya '/my-anime-app/'.
  base: '/<REPO_NAME>/',
})
