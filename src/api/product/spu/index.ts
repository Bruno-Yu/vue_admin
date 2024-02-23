// SPU 管理模塊
import request from '@/utils/request'
import type {
  HasSpuResponseData,
  AllTradeMarkData,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SpuData,
  SkuData,
  SkuInfoData,
} from './type'

enum API {
  // 獲取已有的SPU數據
  HASSPU_URL = '/admin/product/',
  // 獲取品牌數據
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 獲取選定 SPU 下的全部商品圖片
  IMG_URL = '/admin/product/spuImageList/',
  // 獲取選定 SPU 下的全部銷售屬性
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  // 獲取整個項目的全部銷售屬性[顏色、版本、尺碼]
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  // 新增 SPU
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  // 編輯/更新原有 SPU
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  // 新增 SKU 內容
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  // 檢視該 SPU 下所有的 SKU (該 SPU 下所有的商品)
  SKUINFO_URL = '/admin/product/findBySpuId/',
  // 刪除該 SPU
  DELETESPU_URL = '/admin/product/deleteSpu/',
}

// 獲取三級分類下已有的 SPU 數據
export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: string | number,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )

// 獲取品牌數據
export const reqAllTradeMark = () =>
  request.get<any, AllTradeMarkData>(API.ALLTRADEMARK_URL)

// 獲取該 SPU 下該商品所有的圖片
export const reqSpuImageList = (spuId: number) =>
  request.get<any, SpuHasImg>(API.IMG_URL + spuId)

// 獲取選定 SPU 下的全部銷售屬性
export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)

// 獲取整個項目的全部銷售屬性[顏色、版本、尺碼]
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)

// 新增/編輯 SPU
export const reqAddOrUpdateSpu = (data: SpuData) => {
  if (data.id) {
    // 只有更新的 SPU 會有 id
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}
// 新增 SKU 內容
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data)
// 檢視該 SPU 下所有的 SKU (該 SPU 下所有的商品)
export const reqSkuInfo = (spuId: number | string) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId)
// 刪除該 SPU
export const reqDeleteSpu = (spuId: number | string) =>
  request.delete<any, any>(API.DELETESPU_URL + spuId)
