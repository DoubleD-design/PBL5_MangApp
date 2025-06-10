import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import CONFIG from "./src/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": CONFIG.BACKEND_URL,
    },
  },
});
