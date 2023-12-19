import { createApp } from 'vue'
import './style.css'
import ElementPlus from 'element-plus' // 引入 element 插件
import 'element-plus/dist/index.css' // 引入對應樣式
// i18n 配置，但由於這段沒有 ts declare 的 型別，所以會有紅字
// 而此時若運行 run build 也會因為期沒有對應的 ts declaration 而會打包失敗
// 最簡便的解法是 使用 @ts-ignore 來忽略此項目沒有 type 的類型檢測
//@ts-ignore
import zhTw from 'element-plus/dist/locale/zh-tw.mjs' 
import App from '@/App.vue'
// svg插件需要配置代码
import 'virtual:svg-icons-register'
// 引入自定義插件對象: 註冊整個項目的全局組件
import globalComponent from '@/components'
// 引入模板的全局樣式
import '@/styles/index.scss'
// 引入路由進行註冊
import router from './router'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhTw,
})

// 安裝自訂義插件
app.use(globalComponent)
// 註冊路由
app.use(router)
app.mount('#app')
