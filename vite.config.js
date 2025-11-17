import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(   ),
    nodePolyfills({
      exclude: [
        'fs',
        'path',
        'buffer',
        'module'
      ],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
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
  base: './', // <-- **THIS IS THE FIX**
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Add this line
    },
  },
  build: {
    rollupOptions: {
      external: ['chart.js'],
    },
  },
  optimizeDeps: {
    include: ["chart.js"],
  },
})
