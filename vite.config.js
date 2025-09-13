import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  //base: '/juegos/arkanoid/',
  base: './',
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      external: [],
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        // Asegurar que MediaPipe se incluya correctamente
        manualChunks: {
          mediapipe: ['@mediapipe/face_mesh', '@mediapipe/camera_utils']
        }
      }
    },
    // Importante: No hacer tree-shaking de MediaPipe
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  server: {
    allowedHosts: [
      '89e50eb5726a.ngrok-free.app',
      'ca1cb1989b02.ngrok-free.app'
    ]
  },
  // Optimizaciones para MediaPipe
  optimizeDeps: {
    include: ['@mediapipe/face_mesh', '@mediapipe/camera_utils'],
    exclude: []
  },
  define: {
    // Desactivar logs en producción
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
})