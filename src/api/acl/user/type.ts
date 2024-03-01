export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// userData 單一 user 資料
export interface UserData {
  id?: number | string
  createTime?: string
  updateTime?: string
  username: string // 用戶名稱
  password: string
  name: string // 用戶暱稱
  phone?: string | null
  roleName?: string
}

// 取得所有使用者的資料 API 回傳
export interface UsersDataResponse extends ResponseData {
  data: {
    records: UserData[]
    total: number
    size: number
    current: number
    orders: any[]
    optimizeCountSql: boolean
    hitCount: boolean
    countId?: null
    maxLimit?: null
    searchCount: boolean
    pages: number
  }
}

// 單一角色
export interface UserRoleData {
  id?: number | string
  createTime?: string
  updateTime?: string
  roleName?: string
  remark: null
}
// 使用者角色 API 回傳
export interface UserRoleDataResponse extends ResponseData {
  data: {
    assignRoles: UserRoleData[]
    allRolesList: UserRoleData[]
  }
}

// 指派使用者特定角色
export interface AssignUserRole {
  roleIdList: number[]
  userId: number
}

// 批量刪除使用者 payload
export interface DeleteBatchUser {
  idList: number[]
}
