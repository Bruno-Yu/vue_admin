// 用戶訊息數據
// createUserList: 此函式執行回返回一個數組，數組內部包含兩個用戶信息
function createUserList() {
  return [
    {
      userId: 1,
      avatar:
        'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'admin',
      password: '123456',
      desc: '平台管理員',
      roles: ['平台管理員'],
      buttons: ['cuser.detail'],
      routes: ['home'],
      token: 'Admin Token',
    },
    {
      userId: 2,
      avatar:
        'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'system',
      password: '123456',
      desc: '系統管理員',
      roles: ['系統管理員'],
      buttons: ['cuser.detail', 'cuser.user'],
      routes: ['home'],
      token: 'System Token',
    },
  ]
}

// 對外暴露一個數組，數組內部包含兩個 api 接口
// 登入假的 api 接口
// 獲取用戶信息的假的 api 接口
export default [
  // 用户登錄接口
  {
    url: '/api/user/login', //請求地址
    method: 'post', //請求方式
    response: ({ body }) => {
      // 獲取 request body 所攜帶過來的用戶 & 密碼
      const { username, password } = body
      // 確認使否有此用戶
      const checkUser = createUserList().find(
        (item) => item.username === username && item.password === password,
      )
      //没有該用户則返回失敗信息
      if (!checkUser) {
        return { code: 201, data: { message: '帳號或者密碼不正確' } }
      }
      //如果有返回成功信息
      const { token } = checkUser
      return { code: 200, data: { token } }
    },
  },
  // 獲取用户信息
  {
    url: '/api/user/info',
    method: 'get',
    response: (request) => {
      //獲取 request Header 所攜帶token
      const token = request.headers.token
      //查看用户信息是否包含此次token用户
      const checkUser = createUserList().find((item) => item.token === token)
      //若没有則返回失敗的信息
      if (!checkUser) {
        return { code: 201, data: { message: '獲取用戶信息失敗' } }
      }
      //如果有返回成功信息
      return { code: 200, data: { checkUser } }
    },
  },
]
