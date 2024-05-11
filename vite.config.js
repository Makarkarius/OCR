import { fileURLToPath, URL } from 'node:url'
import { DEV_SERVER_URL } from './src/config'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  switch (command) {
    case 'build':
      return {
        optimizeDeps: {
          exclude: ['pdfjs-dist']
        },
        base: '/',
        plugins: [vue()],
        resolve: {
          alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
          }
        }
      }
    case 'serve':
      return {
        optimizeDeps: {
          exclude: ['pdfjs-dist']
        },
        base: '/',
        plugins: [vue()],
        resolve: {
          alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
          }
        },
        server: {
          port: 8082,
          strictPort: true,
          proxy: {
            '/api': {
              target: DEV_SERVER_URL,
              changeOrigin: true,
              secure: false,
              rewrite: (path) => path.replace(/^\/api/, '')
            }
          }
        }
      }
  }
})
