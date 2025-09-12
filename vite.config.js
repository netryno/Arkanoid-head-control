import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // fuerza que los chunks de MediaPipe vayan a assets
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }, 
  server: {
    allowedHosts: [
      '89e50eb5726a.ngrok-free.app',
      'ca1cb1989b02.ngrok-free.app'
    ]
  }
})