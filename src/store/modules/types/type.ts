import type { RouteRecordRaw } from 'vue-router'
import type { CategoryData } from '@/api/product/attr/type'
//  定義 store 中小倉庫的類型
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
}

// 定義 category 倉庫 state 類型
export interface CategoryState {
  c1Arr: CategoryData[]
  c1Id: string | number
  c2Arr: CategoryData[]
  c2Id: string | number
  c3Arr: CategoryData[]
  c3Id: string | number
}
