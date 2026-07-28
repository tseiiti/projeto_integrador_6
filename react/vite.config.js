import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    watch: {
      usePolling: true,
    },

    hmr: {
      host: 'tseiiti.duckdns.org',
      // clientPort: 80, // Use 443 if you are using HTTPS/WSS
    },
    allowedHosts: ['tseiiti.duckdns.org'],
  },
})
