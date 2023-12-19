// 二次封装 axios: 使用請求與響應式攔截器
import axios from 'axios'
import { ElMessage } from 'element-plus' // element 中用來呈現 api 訊息的組件
// import useUserStore from '@/store/modules/user'
// 第一步: 利用 axios 對象的 create 方法，去創建 axios 實例對象
// 如此可方便些功能配置 ex: 基礎路徑、是否有超時
const request = axios.create({
  // 配置基礎路徑
  baseURL: import.meta.env.VITE_APP_BASE_API, // 基礎路徑會協帶我們在 mock 創的 '/api'
  timeout: 5000, // 超時的時間設置 ( 限制在5秒內需處理完成 )
})

// 第二步: request 實例中添加請求攔截器
// request.interceptors.request.use((config)=>{return config})
request.interceptors.request.use(
  (config) => {
    // 使用配置對象 config
    // let userStore = useUserStore()

    //if (userStore.token) {
    // config 的 headers 屬性，通常給伺服器的公共參數可在這設置
    //config.headers.token = userStore.token
    //}

    return config // 必須記得要 return config 回來，否則可能請求連發都發不出去
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 第三步: request 實例中添加響應攔截器
// response 中要放兩個 callback 參數 第一個是成功的，第二個是失敗的
// request.interceptors.response.use((repsone)=>{}, (error)=>{})
request.interceptors.response.use(
  (response) => {
    // 解析 & 簡化數據
    if (response.status === 200) {
      return Promise.resolve(response.data)
    } else {
      return Promise.reject(response.data)
    }
  },
  (error) => {
    // 失敗的 callback 通常處理 http 網路錯誤
    // 定一個變量用來存儲網路錯誤的信息
    let message = ''
    // http 狀態碼
    const status = error.response.status
    switch (status) {
      // 401 token 過期
      case 401:
        message = 'token 過期'
        break
      case 403:
        message = '無權訪問'
        break
      case 404:
        message = '請求地址錯誤'
        break
      case 500:
        message = '伺服器出現問題'
        break
      default:
        message = '網路出現問題'
        // message = error.response.data.message
        break
    }
    // 提示的錯誤信息 ( 這邊使用 element plus 的套件 )
    ElMessage({
      type: 'error',
      message,
    })
    // 需 return 失敗的 Promise 來終結此 promise
    return Promise.reject(error)
  },
)
// 對外暴露
export default request
