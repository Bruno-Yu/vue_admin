// 用戶相關的 api 邏輯型別聲明

// 用戶登入 api 協帶的參數 ts 類型
export interface loginFormData {
  username: string
  password: string
}

// 定義所有 api 共用的結構 type
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 定義登入 api 返回的 data 類型
export interface LoginResponseData extends ResponseData {
  data: string
}

// 定義獲取用戶信息 api 返回數據類型
export interface userInfoResponseData extends ResponseData {
  data: {
    routes: string[]
    buttons: string[]
    roles: string[]
    name: string
    avatar: string
  }
}

// mock data
// 登入 API 邏輯型別

// export interface loginForm {
//   username: string
//   password: string
// }
// interface dataType {
//   token?: string
//   message?: string
// }

// // 登入 api response 的數據型別
// export interface loginResponseData {
//   code: number
//   data: dataType
// }

// // 定義伺服器回傳與用戶相關的數據類型
// interface userInfo {
//   userId: number
//   avatar: string
//   username: string
//   password: string
//   desc: string
//   roles: string[]
//   buttons: string[]
//   routes: string[]
//   token: string
// }

// interface user {
//   checkUser: userInfo
// }

// export interface userResponseData {
//   code: number
//   data: user
// }
