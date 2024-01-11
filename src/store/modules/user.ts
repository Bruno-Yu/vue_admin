// 創建記錄用戶行為的小倉庫
import { defineStore } from 'pinia'
// 引入 api 包裝的方法
import { reqLogin } from '@/api/user'
//   引入 localStorage 存取方法
import { SET_TOKEN, GET_TOKEN } from '@/utils/token'
// 引入數據類型
import type { loginForm, loginResponseData } from '@/api/user/type'
import type { UserState } from './types/type'

const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 存儲用戶登入成功的 token,若尚無則會是 null 值
    }
  },
  actions: {
    // 用戶登入的方法，預計會回傳 Promise ( 請求失敗時 )
    async userLogin(data: loginForm) {
      const result: loginResponseData = await reqLogin(data)
      // 依據設定的 mock api 登入成功 200 是獲得 token 若是失敗則是 201 給予 message
      if (result.code === 200) {
        // 由於 pinia 只存儲在網頁 js 中，只要 reload 後其存取的 state 就會消失
        // 這邊 ts 判斷 result.data.token 可能會是 undefined，所以要用 as 斷言表示這段不會有 undefined 情形
        this.token = result.data.token as string
        // 所以要用 localStorage 將其存取 ( 也有做法是使用 cookies 封裝 token )
        SET_TOKEN(result.data.token as string)
        // 能保證當前 async 函數返回一個成功的 promise
        // 只返回 'success' 是因為不用在 return Promise.resolve 到調用 userLogin 的組件去處理數據了，因為這邊已經用 pinia 存取了
        // 若返回 Promise.resolve 會走 try 路線
        return 'success'
      } else {
        // 若沒有 Promise.reject 回傳錯誤的結果，變數在接收 userLogin 這函式 Promise state 都會是 fullfilled
        // 使用 Promise.reject 會走 catch 路線
        return Promise.reject(new Error(result.data.message))
      }
    },
  },
  getters: {},
})

export default useUserStore
