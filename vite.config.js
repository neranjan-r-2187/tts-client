import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Fix for CSS/asset loading on deployment
  // Use '/' for root domain, '/repo-name/' for GitHub Pages subdirectory
  base: '/',

  css: {
    preprocessorOptions: {},
  },

  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    assetsInlineLimit: 4096,
  },
})
