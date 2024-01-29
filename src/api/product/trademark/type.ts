export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 品牌個別 data
export interface TradeMarkData {
  id?: number // 以後新增品牌 data type 可以共用
  tmName: string
  logoUrl: string
}

// 品牌 list
export type Records = TradeMarkData[]

// 獲取 api 品牌數據的 response type
export interface TradeMarkResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    page: number
  }
}
