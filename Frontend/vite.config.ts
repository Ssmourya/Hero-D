import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // <-- important for correct asset loading
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://hero-d-nry1.vercel.app',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
