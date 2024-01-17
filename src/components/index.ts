// 註冊成全域組件的方式
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
// 引入 element-plus 提供的全部圖標組件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 整成一個對象
const allGlobalComponent = { SvgIcon, Pagination, ElementPlusIconsVue }
//  對外曝露插件對象
export default {
  // 必須要叫 install
  // 其參數有 app 這參數，其內含 component 這方法，可以直接用此方法註冊
  install(app) {
    // install 內部的函式會在入口 main.ts 中掛載 (app.use) 時執行
    // 逐個註冊項目
    Object.keys(allGlobalComponent).forEach((key) => {
      app.component(key, allGlobalComponent[key])
    })
    // 將 element-plus 提供的 所有 圖標註冊成全域組件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
