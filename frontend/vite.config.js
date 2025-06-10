import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "https://mangavn-c8fwghesfqgre2gn.eastasia-01.azurewebsites.net",
    },
  },
});
