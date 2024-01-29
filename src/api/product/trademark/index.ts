// 品牌管理 api
import request from '@/utils/request'
import type { TradeMarkResponseData, TradeMarkData } from './type'
// 品牌管理模塊 api 路徑
// /admin/product/baseTrademark/{page}/{limit}
enum API {
  // 獲取品牌 data
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  // 添加品牌
  ADD_TRADEMARK_URL = '/admin/product/baseTrademark/save',
  // 修改已有的品牌
  UPDATE_TRADEMARK_URL = '/admin/product/baseTrademark/update',
  // 刪除已有的品牌
  DELETE_TRADEMARK_URL = '/admin/product/baseTrademark/remove/',
}
// 獲取資料
// page  獲取第幾頁的數據 --默認第一頁
// limit 獲取幾個項目數據
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(
    API.TRADEMARK_URL + `${page}/${limit}`,
  )

// 添加 & 編輯 資料
export const reqAddOrUpdateTrademark = (data: TradeMarkData) => {
  // 判斷是否 data 有 id 有的話是編輯 反之則是新增
  if (data.id) {
    return request.put<any, any>(API.UPDATE_TRADEMARK_URL, data)
  } else {
    return request.post<any, any>(API.ADD_TRADEMARK_URL, data)
  }
}

// 刪除已有的品牌
export const reqDeleteTrademark = (id: number) =>
  request.delete<any, any>(API.DELETE_TRADEMARK_URL + `${id}`)
