import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react( ),
    nodePolyfills({
      // Exclude specific polyfills that might conflict with Rollup's externalization
      exclude: [
        'fs', // Common Node.js module that might cause issues
        'path', // Already tried this, but good to keep in exclude
        'buffer', // Another common one
        'module' // The module that the polyfills plugin itself uses
      ],
      // Enable specific polyfills if needed, or leave empty to polyfill all by default
      globals: {
        Buffer: true, // Polyfill Buffer global
        global: true, // Polyfill global object
        process: true, // Polyfill process object
      },
      // Whether to polyfill Node.js built-in modules for the browser
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
  base: '/',
  build: {
    rollupOptions: {
      // Keep externalizing if the plugin still warns, but the plugin should handle most cases
      external: [], // Clear this for now, let the plugin manage
    },
  },
})
