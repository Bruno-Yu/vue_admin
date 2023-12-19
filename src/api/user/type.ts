// 用戶相關的 api 邏輯型別聲明
// 登入 API 邏輯型別
export interface loginForm {
  username: string
  password: string
}
interface dataType {
  token: string
}

// 登入 api response 的數據型別
export interface loginResponseData {
  code: number
  data: dataType
}

// 定義伺服器回傳與用戶相關的數據類型
interface userInfo {
  userId: number
  avatar: string
  username: string
  password: string
  desc: string
  roles: string[]
  buttons: string[]
  routes: string[]
  token: string
}

interface user {
  checkUser: userInfo
}

export interface userResponseData {
  code: number
  data: user
}
