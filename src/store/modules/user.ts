// 創建記錄用戶行為的小倉庫
import { defineStore } from 'pinia'
// 引入 api 包裝的方法
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
//   引入 localStorage 互動的方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入路由(常量路由)
import { constantRoute } from '@/router/routes'
// 引入數據類型
// import type { loginForm, loginResponseData } from '@/api/user/type'
import type { loginFormData, LoginResponseData, userInfoResponseData } from '@/api/user/type'
import type { UserState } from './types/type'

const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 存儲用戶登入成功的 token,若尚無則會是 null 值
      menuRoutes: constantRoute, // 倉庫存儲生成菜單需要的數組(路由)
      username: '',
      avatar: '',
    }
  },
  actions: {
    // 用戶登入的方法，預計會回傳 Promise ( 請求失敗時 )
    async userLogin(data: loginFormData) {
      const result: LoginResponseData = await reqLogin(data)
      // 依據設定的 mock api 登入成功 200 是獲得 token 若是失敗則是 201 給予 message
      if (result.code === 200) {
        // 由於 pinia 只存儲在網頁 js 中，只要 reload 後其存取的 state 就會消失
        // 這邊 ts 判斷 result.data.token 可能會是 undefined，所以要用 as 斷言表示這段不會有 undefined 情形
        this.token = result.data as string
        // 所以要用 localStorage 將其存取 ( 也有做法是使用 cookies 封裝 token )
        SET_TOKEN(result.data as string)
        // 能保證當前 async 函數返回一個成功的 promise
        // 只返回 'success' 是因為不用在 return Promise.resolve 到調用 userLogin 的組件去處理數據了，因為這邊已經用 pinia 存取了
        // 若返回 Promise.resolve 會走 try 路線
        return 'success'
      } else {
        // 若沒有 Promise.reject 回傳錯誤的結果，變數在接收 userLogin 這函式 Promise state 都會是 fullfilled
        // 使用 Promise.reject 會走 catch 路線
        return Promise.reject(new Error(result.data))
      }
    },
    // 獲取用戶訊息的方法
    async userInfo() {
      // 獲取用戶信息用以進行用戶基本信息存儲於倉庫中 (用戶頭像、姓名)
      // 若沒有在 request 的 header 上帶對應使用者的 token 則會獲取失敗 ( 201 )
      // 可以透過 request.interceptor 來帶請求 ( 發出請求前先帶上 )
      const result: userInfoResponseData = await reqUserInfo()
      // 如果獲取用戶信息成功則存儲用戶信息
      if (result.code === 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        return 'success'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 用戶登出
    async userLogout() {
      const result: any = await reqLogout()
      if (result.code === 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        // 刪除本地 token
        REMOVE_TOKEN()
        return 'success'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})

export default useUserStore
