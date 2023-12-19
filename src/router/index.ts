// 利用 vue-router 套件來實現模板路由配置
// createWebHashHistory 對應 路由模式 hash
// createWebHistory 對應 路由模式 history
import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoute } from './routes'
// 創建路由器
const router = createRouter({
  // 路由模式 hash 或是 history
  history: createWebHashHistory(),
  routes: constantRoute,
  // 滾動行為
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})

export default router
