import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to backend during development
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@mui/material', '@emotion/react', '@emotion/styled', '@mui/icons-material'],
  },
})