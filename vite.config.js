import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    allowedHosts: [
      '89e50eb5726a.ngrok-free.app',
      'ca1cb1989b02.ngrok-free.app'
    ]
  }
})