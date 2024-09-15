import { defineConfig, loadEnv } from 'vite'
// loadEnv vite 提供的方法可以加載環境量
import vue from '@vitejs/plugin-vue'
import path from 'path'
// mock 數據
// import { ConfigEnv, UserConfigExport, loadEnv } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
// 引入svg
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // mode 是只環境，若無設定則預設就是開發模式
  // loadEnv 函式執行後會返回目前環境(dev, pro, test...etc.)已配置的 env 變量
  // loadEnv 有 2 個參數，參數1:目前模式; 參數2: 環境變數位置
  // 若要位置，我們必須提供代表根目錄的 vite api 'process.cwd()' ( https://vitejs.dev/config/shared-options.html#root )
  const env = loadEnv(mode, process.cwd())
  const isDev = command === 'serve'
  // proxy 路徑的 rewrite 正則變數
  const proxyReWriteRegex = new RegExp(`^${env.VITE_APP_BASE_API}`)
  return {
    base: '/vue_admin/',
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
    // proxy 代理跨域 ( vite 介紹網址: https://vitejs.dev/config/server-options.html#server-proxy )
    server: isDev
      ? {
          proxy: {
            // vue.config 取 env 的方式
            [env.VITE_APP_BASE_API]: {
              target: env.VITE_SERVER, // server 路徑位置
              changeOrigin: true, //需要代理跨域
              rewrite: (path) => path.replace(proxyReWriteRegex, ''), // 路徑重寫
            },
          },
        }
      : undefined,
  }
})
