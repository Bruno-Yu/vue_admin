<template>
  <el-form label-width="100px">
    <el-form-item label="SPU 名稱">
      <el-input placeholder="請您輸入SPU名稱" />
    </el-form-item>
    <el-form-item label="SPU 品牌">
      <el-select>
        <el-option label="Apple"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU 描述">
      <el-input type="textarea" placeholder="請你輸入SPU的描述" />
    </el-form-item>
    <el-form-item label="SPU 圖片">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog v-model:visible="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU 銷售屬性">
      <!-- 展示銷售屬性 -->
      <el-select>
        <el-option label="藍色"></el-option>
      </el-select>
      <el-button type="primary" icon="Plus" class="btn-plus">
        添加銷售屬性
      </el-button>
      <!-- table 展示銷售屬性與屬性值 -->
      <el-table class="table-card" border>
        <el-table-column
          label="序號"
          type="index"
          align="center"
          width="80px"
        />
        <el-table-column label="銷售屬性名" width="120px" />
        <el-table-column label="銷售屬性值"></el-table-column>
        <el-table-column label="操作" width="120px"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button type="secondary" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts">
export default {
  name: 'SpuForm',
}
</script>
<script lang="ts" setup>
import { defineEmits, defineExpose, ref } from 'vue'
import type { TradeMarkResponseData, TradeMarkData } from '@/api/product/trademark/type'
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
} from '@/api/product/spu'
import type { SpuData, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData, SpuImg, saleAttr, HasSaleAttr } from '@/api/product/spu/type'
const $emit = defineEmits(['changeScene'])
// 點擊取消，通知父組件切換場景
const cancel = () => {
  $emit('changeScene', 0)
}
// 存取此頁 api 獲得的數據
const AllTradeMark = ref<TradeMarkData[]>([])
const imgList = ref<SpuImg[]>([])
// 選定 spu 銷售屬性
const saleAttrData = ref<saleAttr[]>([])
// 所有屬性
const allSaleAttrData = ref<HasSaleAttr[]>([])
// 獲取 api 資料
const initHasSpuData = async (row: SpuData) => {
  // row 為父組件傳遞的 spu object 但尚不完整
  // 獲取全部品牌資訊
  const reqAllTradeMarkResult: TradeMarkResponseData = await reqAllTradeMark()
  AllTradeMark.value = reqAllTradeMarkResult.data
  // 獲取該品牌下的所有圖片
  const reqSpuImageResult: SpuHasImg = await reqSpuImageList(row.id as number)
  imgList.value = reqSpuImageResult.data
  // 獲取已有 SPU 銷售屬性的數據
  const reqSpuHasSaleAttrResult: SaleAttrResponseData = await reqSpuHasSaleAttr(row.id as number)
  saleAttrData.value = reqSpuHasSaleAttrResult.data
  // 獲取整個項目的全部銷售屬性[顏色、版本、尺碼]
  const reqAllSaleAttrResult: HasSaleAttrResponseData = await reqAllSaleAttr()
  console.log('reqAllSaleAttrResult', reqAllSaleAttrResult)
}

// 對外暴露
defineExpose({ initHasSpuData })
</script>
<style lang="scss" scoped>
.btn-plus {
  margin-left: 10px;
}

.table-card {
  margin: 10px 0;
}
</style>
