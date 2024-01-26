// 封裝本必存儲數據與讀取數據的方法
export const SET_TOKEN = (token: string) => {
  localStorage.setItem('TOKEN', token)
}

// 本地獲取用戶資料時所存取的 token
export const GET_TOKEN = () => {
  return localStorage.getItem('TOKEN')
}
// 本地用戶資料登出時，刪除 token
export const REMOVE_TOKEN = () => {
  return localStorage.removeItem('TOKEN')
}
