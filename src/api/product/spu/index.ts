// SPU 管理模塊
import request from '@/utils/request'
import type {
  HasSpuResponseData,
  SpuHasImg,
  spuSaleAttrValueList,
  HasSaleAttrResponseData,
} from './type'
import type { TradeMarkResponseData } from '../trademark/type'

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
  request.get<any, TradeMarkResponseData>(API.ALLTRADEMARK_URL)

// 獲取該 SPU 下該商品所有的圖片
export const reqSpuImageList = (spuId: number) =>
  request.get<any, SpuHasImg>(API.IMG_URL + spuId)

// 獲取選定 SPU 下的全部銷售屬性
export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, spuSaleAttrValueList>(API.SPUHASSALEATTR_URL + spuId)

// 獲取整個項目的全部銷售屬性[顏色、版本、尺碼]
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)
