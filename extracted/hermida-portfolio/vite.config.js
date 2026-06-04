import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Hermida Portfolio',
        short_name: 'Portfolio',
        description: 'Jonathan Hermida personal investment tracker',
        theme_color: '#070d18',
        background_color: '#070d18',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/query1\.finance\.yahoo\.com/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'yahoo-finance',
              expiration: { maxAgeSeconds: 900 }
            }
          }
        ]
      }
    })
  ]
})
