import type { RouteRecordRaw } from 'vue-router'
//  定義 store 中小倉庫的類型
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
}
