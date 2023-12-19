import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// mock 數據
// import { ConfigEnv, UserConfigExport, loadEnv } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
// 引入svg
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // specify symbolId format
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        localEnabled: command === 'serve',
        // prodEnabled: command !== 'serve',
      }),
    ],
    resolve: { alias: { '@': path.resolve('./src') } },
    //scss 全局變量的配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
  }
})
