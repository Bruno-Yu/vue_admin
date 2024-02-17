export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SPU 數據類型
export interface SpuData {
  id?: number // 只有已有的會有 id
  spuName: string // SPU 的名字
  description: string // SPU 描述
  category3Id: string | number // 第三類的 id
  tmId: string | number // 品牌 id
  spuSaleAttrList: null | saleAttr[] // 拿取數據時的 api 沒有，但更新或新增的 api 要有
  spuImageList: null | SpuImg[] // 拿取數據時的 api 沒有，但更新或新增的 api 要有
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

// 定義品牌
export interface TradeMarkData {
  id?: number // 以後新增品牌 data type 可以共用
  tmName: string
  logoUrl: string
}

// GET 品牌
export interface AllTradeMarkData extends ResponseData {
  data: TradeMarkData[]
}

// 定義商品圖片的資料類型
export interface SpuImg {
  id?: number
  createTime?: string
  updateTime?: string
  spuId?: number
  imgName?: string
  imgUrl?: string
  name?: string // el-upload v-model:file-list 需求格式
  url?: string // el-upload v-model:file-list 需求格式
}

// 定義 GET 該 SPU 商品圖片的資料類型
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}

// 個別銷售屬性值物件
export interface SaleAttrValue {
  id?: number // 新增不會有 id
  createTime?: string
  updateTime?: string
  spuId?: number
  baseSaleAttrId: number // 基礎屬性 Id
  saleAttrValueName: string // 此屬性的名字
  saleAttrName?: string // SaleAttr name
  isChecked?: null
}

// 銷售屬性值物件 array
export type spuSaleAttrValueList = SaleAttrValue[]

// 個別銷售屬性物件
export interface saleAttr {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number // 基礎屬性 Id
  saleAttrName: string // 此屬性的名字
  spuSaleAttrValueList: spuSaleAttrValueList
  inputActive?: boolean // 在 SPU 新增 tag 所需，作為辨別是否顯示編輯欄框的引用樣式
  saleAttrValue?: string // 在 SPU 新增 tag 所需，做為暫存使用者新輸入的屬性值所用
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
