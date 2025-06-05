import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/douyu-prize/',
  server: {
    proxy: {
      '/wxapp-douyucdn-cn': {
        target: 'https://wxapp.douyucdn.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wxapp-douyucdn-cn/, ''),
      },
    },
  },
})
