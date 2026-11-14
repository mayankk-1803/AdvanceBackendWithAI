import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or whatever plugin you use

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all local IP addresses
    port: 5173  // Ensure it matches your port
  }
})