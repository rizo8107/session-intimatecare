import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['4a9d-106-219-176-57.ngrok-free.app'],
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});