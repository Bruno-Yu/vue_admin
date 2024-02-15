export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SPU 數據類型
export interface SpuData {
  id?: number
  spuName: string
  description: string
  category3Id: string | number
  tmId: number // 品牌 id
  spuSaleAttrList: null // 在另一個 api
  spuImageList: null // 在另一個 api
}

//  array
export type Records = SpuData[]

// 定義 GET SPU API 回傳 data
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number //總共品項
    size: number // 每頁幾筆
    current: number // 目前頁面
    searchCount: boolean //
    pages: number // 一共幾頁
  }
}

// 定義商品圖片的資料類型
export interface SpuImg {
  id: number
  createTime: string
  updateTime: string
  spuId: number
  imgName: string
  imgUrl: string
}

// 定義 GET 該 SPU 商品圖片的資料類型
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}

// 個別銷售屬性值物件
export interface SaleAttrValue {
  id?: number // 新增不會有 id
  createTime: string
  updateTime: string
  spuId: number
  baseSaleAttrId: number
  saleAttrValueName: string
  saleAttrName: string
  isChecked: null
}

// 銷售屬性值物件 array
export type spuSaleAttrValueList = SaleAttrValue[]

// 個別銷售屬性物件
export interface saleAttr {
  id?: number
  createTime: null
  updateTime: null
  spuId: number
  baseSaleAttrId: number
  saleAttrName: string
  spuSaleAttrValueList: spuSaleAttrValueList
}

// 定義 GET 該 SPU 銷售屬性物件回傳資料類型
export interface SaleAttrResponseData extends Response {
  data: saleAttr[]
}

// 已有全部SPU的銷售屬性
export interface HasSaleAttr {
  id: number
  name: string
}

// GET 已有全部SPU的銷售屬性
export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}
