export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//  sku 的個別平台屬性
export interface skuAttrValue {
  attrId: string | number // 平台屬性 id
  valueId: string | number // 平台屬性值 id
  attrName?: string
  id?: number
  skuId?: number
  valueName?: string
}

export interface skuImage {
  id: number
  imgName: string
  imgUrl: string
  isDefault: string
  skuId: number
  spuImgId: number
}

export interface skuSaleAttrValue {
  saleAttrId: string | number // 銷售屬性 id
  saleAttrValueId: string | number // 銷售屬性值 id
  id?: number
  saleAttrName?: string
  saleAttrValueName?: string
  skuId?: number
  spuId?: number
}
// 新增 SKU API 的 payload
export interface SkuData {
  createTime?: string
  id?: number
  category3Id: string | number // 三級分類 id
  spuId: string | number // 該 spu Id
  tmId: string | number // 該 spu 的品牌 id
  skuName: string // sku 名稱
  price: string | number // sku 價格
  weight: string // sku 重量
  skuDesc: string // sku 描述
  skuAttrValueList: skuAttrValue[] //sku 的平台屬性
  skuSaleAttrValueList: skuSaleAttrValue[] // sku 銷售屬性
  skuDefaultImg: string // 此 sku 圖片 url
  isSale?: number //  0: 下架; 1: 上架
  skuImageList?: skuImage[]
}

// 獲得 已有的 SKU 內容
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number // 總數有暨個
    size: number // 每頁幾個
    current: number // 目前頁面
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number // 共用幾頁
  }
}
