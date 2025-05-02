import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5010',  // Ensure requests go to backend
    }
  }
});

