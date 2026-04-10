import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Dev server uses `/`; production build uses repo base for GitHub Pages.
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/Permissions/',
  plugins: [react()],
}))
