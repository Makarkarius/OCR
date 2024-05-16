import { fileURLToPath, URL } from 'node:url'
import { SERVER_URL } from './src/config'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  switch (command) {
    case 'build':
      return {
        build: {
          target: 'esnext'
        },
        optimizeDeps: {
          exclude: ['pdfjs-dist'],
          esbuildOptions: {
            target: 'esnext'
          }
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
              target: SERVER_URL,
              changeOrigin: true,
              secure: false,
              rewrite: (path) => path.replace(/^\/api/, '')
            }
          }
        }
      }
  }
})
