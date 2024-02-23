// 分類的 type
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface CategoryData {
  id: number | string
  name: string
  category1Id?: number | string
  category2Id?: number | string
}

export interface CategoryResponseData extends ResponseData {
  data: CategoryData[]
}

export interface AttrValueData {
  id?: number | string
  valueName: string
  attrId?: number
  isEditing?: boolean
}

export interface AttrData {
  id?: number | string
  attrName: string
  categoryId: number | string
  categoryLevel: number | string
  attrValueList: AttrValueData[]
  attrIdAndValueId?: string | undefined // 用於在 SPU/skuForm 存取個別屬性所選擇的值
}

export interface AttrResponseData extends ResponseData {
  data: AttrData[]
}
