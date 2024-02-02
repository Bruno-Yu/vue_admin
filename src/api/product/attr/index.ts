// 屬性相關的 API 邏輯
import request from '@/utils/request'
import type { CategoryResponseData, AttrResponseData } from './type'

// 獲取屬性管理模塊的 api
enum API {
  // 獲取一級分類
  C1_URL = '/admin/product/getCategory1',
  // 獲取二級分類
  C2_URL = '/admin/product/getCategory2/',
  // 獲取三級分類
  C3_URL = '/admin/product/getCategory3/',
  // 獲取在有一級二級以及三級 id 的屬性數值
  ATTR_URL = '/admin/product/attrInfoList/',
}

// 獲取一級分類的 API
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)
// 獲取二級分類的 API
export const reqC2 = (category1Id: number) =>
  request.get<any, CategoryResponseData>(API.C2_URL + category1Id)
// 獲取三級分類的 API
export const reqC3 = (category2Id: number) =>
  request.get<any, CategoryResponseData>(API.C3_URL + category2Id)
// 獲取屬性值
export const reqAttr = (
  category1Id: number | string,
  category2Id: number | string,
  category3Id: number | string,
) =>
  request.get<any, AttrResponseData>(
    API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`,
  )
