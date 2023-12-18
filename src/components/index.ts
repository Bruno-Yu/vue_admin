// 註冊成全域組件的方式
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'

// 整成一個對象
const allGlobalComponent = { SvgIcon, Pagination }

//  對外曝露插件對象
export default {
  // 必須要叫 install
  // 其參數有 app 這參數，其內含 component 這方法，可以直接用此方法註冊
  install(app) {
    // install 內部的函式會在入口 main.ts 中掛載 (app.use) 時執行
    console.log(app, 123)
    // 逐個註冊項目
    Object.keys(allGlobalComponent).forEach((key) => {
      console.log(key)
      app.component(key, allGlobalComponent[key])
    })
  },
}
