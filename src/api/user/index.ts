// 統一管理用戶相關的 api 邏輯
import request from '@/utils/request'
// mock data type
// import type { loginForm, loginResponseData, userResponseData } from './type'
// api data type
import type {
  loginFormData,
  LoginResponseData,
  userInfoResponseData,
} from './type'
// import type 相較於 import 只會帶入類型信息，相較於使用 import, import type 可以帶來更好的性能與維護性
// 統一管理接口
// 項目與用戶相關的請求地址
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}
// 登入 API ( 泛型的第二個參數是 server 所返回的 data 類型 )
export const reqLogin = (data: loginFormData) =>
  request.post<any, LoginResponseData>(API.LOGIN_URL, data)

// 獲取用戶信息
export const reqUserInfo = () =>
  request.get<any, userInfoResponseData>(API.USERINFO_URL)

// 退出登入
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)

// mock data
// enum API {
//   LOGIN_URL = '/user/login',
//   USERINFO_URL = '/user/info',
// }
// // 暴露請求函式
// // 登入 API 方法
// export const reqLogin = (data: loginForm) =>
//   request.post<any, loginResponseData>(API.LOGIN_URL, data)
// // 獲取用戶信息 api 方法
// export const reqUserInfo = () =>
//   request.get<any, userResponseData>(API.USERINFO_URL)
