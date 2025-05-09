import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],

    resolve: {
      alias: {
        '@resources': resolve('resources'),
        '@src': resolve('src')
      }
    }
  },

  preload: {
    plugins: [externalizeDepsPlugin()]
  },

  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@components': resolve('src/renderer/src/components'),
        '@src': resolve('src')
      }
    },
    plugins: [vue(), UnoCSS()]
  }
})
