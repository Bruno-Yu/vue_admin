// 統一管理用戶相關的 api 邏輯
import request from '@/utils/request'
import type { loginForm, loginResponseData, userResponseData } from './type'
// import type 相較於 import 只會帶入類型信息，相較於使用 import, import type 可以帶來更好的性能與維護性
// 統一管理接口
enum API {
  LOGIN_URL = '/user/login',
  USERINFO_URL = '/user/info',
}
// 暴露請求函式
// 登入 API 方法
export const reqLogin = (data: loginForm) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)
// 獲取用戶信息 api 方法
export const reqUserInfo = () =>
  request.get<any, userResponseData>(API.USERINFO_URL)
