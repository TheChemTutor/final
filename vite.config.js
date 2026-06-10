/*
  vite.config.js — Vite build configuration.

  base: '/' — Vercel serves from the domain root, no sub-path needed.

  server.proxy: During local dev (`npm run dev`), Vite forwards /api/*
  to the Vercel CLI dev server on port 3000, which runs the serverless
  function locally. Run both with:
    Terminal 1 — npx vercel dev   (port 3000, runs frontend + api together)
  Or separately:
    Terminal 1 — npx vercel dev
    Terminal 2 — npm run dev      (Vite on 5173, proxies /api to 3000)

  The simplest local dev is just: npx vercel dev
*/
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Vercel serves from root — no sub-path needed unlike GitHub Pages
  base: '/',

  server: {
    proxy: {
      '/api': {
        target:       'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
