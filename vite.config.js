import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
<<<<<<< HEAD

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react( )],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
    watch: {
      usePolling: true,
    },
  },
  // Add this line:
  base: '/', // Make sure to include the comma if it's not the last property
})
=======
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: 'all'
  }
})

>>>>>>> 4b1c700291d43f05d253a70f3ccf1c2407b9c29c
