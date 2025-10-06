import { defineConfig, loadEnv, mergeConfig } from 'vite'
import baseConfig from './vite.base.config'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return mergeConfig(
    baseConfig,
    defineConfig({
      server: {
        // Only for development environment
        proxy: {
          '/api': {
            target: env.VITE_API_SERVER_URL,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '/onlineShop')
          }
        }
      }
    })
  )
})
