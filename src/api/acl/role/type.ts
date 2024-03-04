export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// RoleData 單一 role 資料
export interface RoleData {
  id?: number | string
  createTime?: string
  updateTime?: string
  roleName: string
  remark: null | string
}

// 取得所有使用者的資料 API 回傳
export interface RolesDataResponse extends ResponseData {
  data: {
    records: RoleData[]
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
