import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/gettabledata': {
        target: 'https://backend.jotish.in',
        changeOrigin: true,
        rewrite: () => '/backend_dev/gettabledata.php',
      },
    },
  },
})
