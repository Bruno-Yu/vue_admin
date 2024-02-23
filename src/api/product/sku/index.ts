import request from '@/utils/request'
import type { SkuResponseData } from './type'

enum API {
  // 獲得 已有的 SKU 內容
  HASSKU_URL = '/admin/product/list/',
  // SKU 上架
  ONSALE_URL = '/admin/product/onSale/',
  // SKU 下架
  OFFSALE_URL = '/admin/product/cancelSale/',
}
// 獲得 已有的 SKU 內容
export const reqSkuList = (page: number, pageSize: number) =>
  request.get<any, SkuResponseData>(API.HASSKU_URL + `${page}/${pageSize}`)

// 商品上下架 API
export const reqSkuOnAndOffSale = (isSale: number, skuId: number | string) => {
  if (isSale === 1) { // 若 1 為上架
    return request.get<any, any>(API.ONSALE_URL + `${skuId}`)
  } else {
    return request.get<any, any>(API.OFFSALE_URL + `${skuId}`)
  }
}
