import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Room-Availability-Checker/',
  server: {
    port: 5173,
    open: true,
  },
})