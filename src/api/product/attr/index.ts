// 屬性相關的 API 邏輯
import request from '@/utils/request'
import type { CategoryResponseData, AttrResponseData, AttrData } from './type'

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
  // 新增或修改屬性 api
  ADD_OR_UPDATE_URL = '/admin/product/saveAttrInfo',
  // 刪除某一屬性 api
  DELETE_ATTR_URL = '/admin/product/deleteAttr/',
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
// 新增或修改屬性 api
export const reqAddOrUpdateAttr = (data: AttrData) =>
  request.post<any, any>(API.ADD_OR_UPDATE_URL, data)
// 刪除某一屬性
export const reqDeleteAttr = (id: number) =>
  request.delete<any, any>(API.DELETE_ATTR_URL + id)
