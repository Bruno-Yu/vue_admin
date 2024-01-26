// 路由權限設置 ( 某個路由在甚麼條件下可以 & 不可以訪問 )
import router from '@/router'
import setting from './setting'
// 進度條插件
// 任意路由切換，實現進度條的邏輯---  使用 nprogress 插件
// nprogress.start(); nprogress 方法，代表進度條開始
// nprogress.done(); nprogress 方法，代表進度條結束
// nprogress.configure({ showSpinner: false }) 是否需要加載的轉圈圈
import nprogress from 'nprogress'
// 引入進度條插件的樣式
import '@/styles/nprogress.scss'
nprogress.configure({ showSpinner: false }) // 取消加載轉圈圈
// 從 pinia 中獲取與用戶相關的 pinia 的 token 用此判斷用戶使否登入成功
import useUserStore from './store/modules/user'
// 特別須注意，在 src 外想使用 pinia 小倉庫時，必須引入大倉庫
import pinia from './store'
// 若只引入小倉庫 useUserStore，沒引入大倉庫的話，pinia  會因為不在 src 中而拋出 Uncaught Error: [🍍]: "getActivePinia()" was called
// 大倉庫必須先做為參數傳入小倉庫的創建函式
const userStore = useUserStore(pinia)

// 全局守衛 middleware 項目中任意路由的切換都會觸發
// 配置全局前置守衛: 訪問某一路由前會觸發執行
router.beforeEach(async (to: any, from: any, next: any) => {
  // to 與 from 都是 route objects，若要繼續載如記得要 call 'next'
  // to 你要訪問哪個路由; from 你自哪個路由而來
  // next 路由的放行函式 ( 若無執行則畫面會被卡住 )
  console.log('to', to)

  nprogress.start()
  // 獲取登入用戶的 token
  const token = userStore.token
  // 獲取用戶姓名 (因為 localStorage 目前只存 token，沒有存用戶信息 ex: username, avatar )
  const username = userStore.username
  if (token) {
    // 登入成功
    // 用戶登入的判斷，不能進 login 頁面，且須導回原頁面
    if (to.path === '/login') {
      next({ path: from.path || '/' })
    } else {
      // 排除登入頁面，但當 reload 時，因為 localStorage 只存 token 沒有用戶信息，所以會消失
      // 判斷是否有用戶信息
      if (username) {
        next()
      } else {
        // 若有 token 但沒有用戶信息，則在 middleware 這邊發出獲取用戶信息的請求後再放行
        try {
          await userStore.userInfo()
          next()
        } catch (error) {
          // 情境一: token 過期導致獲取不到用戶信息
          // 情境二: 用戶手動修改本地存儲 token
          // 邏輯: 應讓用戶登出並回到登入頁面
          // 需要將 pinia 內存取的數據清空 ( token, username, avatar )
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    // 未登入
    // 用戶未登入的判斷，只能在 login 頁
    if (to.path === '/login') {
      next()
    } else {
      // 若不是登入頁都轉往登入頁
      // 增加邏輯是，存取用戶原想去的路由，以利用戶登入時直接導向
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
  next()
})
// 配置全局後置守衛: 離開某一路由前會觸發執行
router.afterEach((to: any, from: any, next: any) => {
  // 加入路由改變時，title 也跟著改變的邏輯 ( 最好加在這，否則加在 beforeEach 會有 bug )
  document.title = `${setting.title}-${to.meta.title}`
  nprogress.done()
})

// 路由權限設置 ( 某個路由在甚麼條件下可以 & 不可以訪問 )
// 目前全部的路由( 總共七個路由 ): 登入|404|任意路由|首頁(二級)|數據大屏|權限管理(有三個子路由)|商品管理(有四個子路由) ( 要注意的是有混雜一級 & 二級路由  )

// 用戶未登入: 可以訪問 login，其餘六個路由不能被訪問( 指向 login )
// 用戶登入成功: 不可以訪問 login ( 指向首頁 )，其餘的路由可以訪問
