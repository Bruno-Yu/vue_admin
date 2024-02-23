<template>
  <el-form label-width="100px">
    <el-form-item label="名稱">
      <el-input
        v-model="skuData.skuName"
        placeholder="請輸入 SKU 名稱"
      ></el-input>
    </el-form-item>
    <el-form-item label="價格(元)">
      <el-input
        v-model="skuData.price"
        type="number"
        placeholder="請輸入價格"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input
        v-model="skuData.weight"
        type="number"
        placeholder="請輸入重量"
      ></el-input>
    </el-form-item>
    <el-form-item label="描述">
      <el-input
        v-model="skuData.skuDesc"
        type="textarea"
        placeholder="請輸入 SKU 描述"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台屬性">
      <el-form :inline="true">
        <el-form-item
          v-for="(item, index) in attrData"
          :key="item.id"
          :label="item.attrName"
        >
          <!-- 在那單一平台屬性欄位創造一個新屬性存取已選中的內容
        這樣的好處就是不會創造出多個不確定數量的可變數 -->
          <el-select v-model="item.attrIdAndValueId">
            <el-option
              v-for="attr in item.attrValueList"
              :key="attr.id"
              :label="attr.valueName"
              :value="`${item.id}:${attr.id}`"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="銷售屬性">
      <el-form :inline="true">
        <el-form-item
          v-for="item in saleAttrData"
          :key="item.id"
          :label="item.saleAttrName"
        >
          <el-select v-model="item.saleAttrIdAndSaleAttrValueId">
            <el-option
              v-for="saleAttr in item.spuSaleAttrValueList"
              :key="saleAttr.id"
              :label="saleAttr.saleAttrValueName"
              :value="`${item.id}:${saleAttr.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="圖片名稱">
      <el-table ref="imgTable" border :data="imgList">
        <el-table-column type="selection" width="80px" align="center" />
        <el-table-column label="圖片">
          <template #="{ row }">
            <img :src="row.imgUrl" :alt="row.imgUrl" class="img-preview" />
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名稱" />
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button type="warning" size="small" @click="imgHandler(row)">
              默認設置
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="secondary" class="btn-plus" @click="cancel">
        取消
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts">
export default {
  name: 'SkuForm',
}
</script>
<script lang="ts" setup>
import { defineEmits, defineExpose, ref } from 'vue'
import { ElMessage } from 'element-plus' // element 中用來呈現 api 訊息的組件
import { reqAttr } from '@/api/product/attr'
import {
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAddSku,
} from '@/api/product/spu'
import { AttrResponseData, AttrData } from '@/api/product/attr/type'
import type {
  SpuData,
  SpuHasImg,
  SaleAttrResponseData,
  SpuImg,
  saleAttr,
  SkuData,
  skuAttrValue,
  skuSaleAttrValue,
} from '@/api/product/spu/type'

const $emit = defineEmits(['changeScene'])

// 存取此頁 sku 所有的數據
const skuData = ref<SkuData>({
  category3Id: '', // 三級分類 id
  spuId: '', // 該 spu Id
  tmId: '', // 該 spu 的品牌 id
  skuName: '', // sku 名稱
  price: '', // sku 價格
  weight: '', // sku 重量
  skuDesc: '', // sku 描述
  skuAttrValueList: [], //sku 的平台屬性
  skuSaleAttrValueList: [], // sku 銷售屬性
  skuDefaultImg: '', // 此 sku 圖片 url
})

const emptySkuData = {
  category3Id: '', // 三級分類 id
  spuId: '', // 該 spu Id
  tmId: '', // 該 spu 的品牌 id
  skuName: '', // sku 名稱
  price: '', // sku 價格
  weight: '', // sku 重量
  skuDesc: '', // sku 描述
  skuAttrValueList: [], //sku 的平台屬性
  skuSaleAttrValueList: [], // sku 銷售屬性
  skuDefaultImg: '', // 此 sku 圖片 url
}

// 存取所有平台屬性，以及使用者選取的屬性 attrIdAndValueId
const attrData = ref<AttrData[]>([])
// 存取此 spu 銷售屬性，以及使用者選取的屬性 saleAttrIdAndSaleAttrValueId
const saleAttrData = ref<saleAttr[]>([])

// 獲取照片牆 table 的 instance
const imgTable = ref()

// 存取照片牆
const imgList = ref<SpuImg[]>([])

// 照片牆的默認設置的方法
const imgHandler = (row: SpuImg) => {
  imgTable.value.clearSelection() // 先清除全部選擇
  imgTable.value.toggleRowSelection(row, true) // 只選當前圖片
  skuData.value.skuDefaultImg = row.imgUrl as string
}

// 清空本頁面數據
const clearSkuData = () => {
  skuData.value = JSON.parse(JSON.stringify(emptySkuData))
}

// 子組件對父組件暴露的方法(獲取 SKU 顯示所需要的數據)
const initSkuData = async (
  category1Id: string | number,
  category2Id: string | number,
  row: SpuData,
) => {
  clearSkuData()
  // row 為父組件傳遞
  skuData.value.category3Id = row.category3Id
  skuData.value.spuId = row.id as number
  skuData.value.tmId = row.tmId
  // 獲取平台屬性(需要 category 1/2/3 級 id)
  const reqAttrResult: AttrResponseData = await reqAttr(
    category1Id,
    category2Id,
    row.category3Id,
  )
  attrData.value = reqAttrResult.data
  // if (reqAttrResult.code === 200) {
  // }
  // 獲取對應的銷售屬性
  const reqSpuHasSaleAttrResult: SaleAttrResponseData = await reqSpuHasSaleAttr(
    row.id as number,
  )
  saleAttrData.value = reqSpuHasSaleAttrResult.data
  // 獲取照片牆數據
  const reqSpuImageListResult: SpuHasImg = await reqSpuImageList(
    row.id as number,
  )
  imgList.value = reqSpuImageListResult.data
}
defineExpose({ initSkuData })

const save = async () => {
  // 整理參數
  // 平台屬性
  skuData.value.skuAttrValueList = attrData.value.reduce(
    (prev: skuAttrValue[], next: AttrData) => {
      // 如果有 attrIdAndValueId 代表有被選取
      if (next.attrIdAndValueId) {
        const [attrId, valueId] = next.attrIdAndValueId.split(':')
        prev.push({ attrId, valueId })
      }
      return prev
    },
    [],
  )
  skuData.value.skuSaleAttrValueList = saleAttrData.value.reduce(
    (prev: skuSaleAttrValue[], next: saleAttr) => {
      if (next.saleAttrIdAndSaleAttrValueId) {
        const [saleAttrId, saleAttrValueId] =
          next.saleAttrIdAndSaleAttrValueId.split(':')
        prev.push({ saleAttrId, saleAttrValueId })
      }
      return prev
    },
    [],
  )
  // 發請求
  const saveResult = await reqAddSku(skuData.value)
  if (saveResult.code === 200) {
    ElMessage({
      type: 'success',
      message: '添加 SKU 成功',
    })
    $emit('changeScene', { sceneNo: 0, action: '' }) // 跳轉頁面
  } else {
    ElMessage({
      type: 'error',
      message: '添加 SKU 失敗',
    })
  }
}

const cancel = () => {
  $emit('changeScene', { sceneNo: 0, action: '' })
}
</script>
<style lang="scss" scoped>
// .skuForm {
//   w
// }
.btn-plus {
  margin-left: 10px;
}

.img-preview {
  height: 100%;
  width: 100%;
}
</style>
