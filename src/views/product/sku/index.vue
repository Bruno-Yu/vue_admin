<template>
  <el-card>
    <el-table class="table" :data="skuListData" border>
      <el-table-column type="index" label="序號" align="center" width="80px" />
      <el-table-column
        label="名稱"
        prop="skuName"
        show-overflow-tooltip
        width="150px"
      />
      <el-table-column
        label="描述"
        prop="skuDesc"
        show-overflow-tooltip
        width="150px"
      />
      <el-table-column label="默認圖片" width="150px">
        <template #="{ row }">
          <img
            :src="row.skuDefaultImg"
            :alt="`${row.skuName}'s image'`"
            class="sku-img"
          />
        </template>
      </el-table-column>
      <el-table-column label="重量(g)" prop="weight" width="150px" />
      <el-table-column label="價格(元)" prop="price" width="150px" />
      <el-table-column label="操作" width="250px" fixed="right">
        <template #="{ row }">
          <el-button
            :type="!row.isSale ? 'info' : 'success'"
            size="small"
            :icon="!row.isSale ? 'Bottom' : 'Top'"
            @click="skuOnAndOffSale(row)"
          />
          <el-button type="primary" size="small" icon="Edit" @click="isEdit" />
          <el-button type="info" size="small" icon="InfoFilled" />
          <el-button type="danger" size="small" icon="Delete" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      :page-sizes="[10, 20, 30, 40]"
      v-model:page-size="pageSize"
      layout="prev, pager, next, jumper,->,sizes,total"
      :background="true"
      :total="total"
      @current-change="getHasSku"
      @size-change="changePaginationSize"
    />
  </el-card>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus' // element 中用來呈現 api 訊息的組件
import { reqSkuList, reqSkuOnAndOffSale } from '@/api/product/sku'
import type { SkuResponseData, SkuData } from '@/api/product/sku/type'
const skuListData = ref<SkuData[]>([])
// 分頁器
const pageNo = ref<number>(1)
// 每頁幾筆數據
const pageSize = ref<number>(10)
// sku total number
const total = ref<number>(0)

// 取得已有的 sku
const getHasSku = async (page = 1) => {
  pageNo.value = page
  const reqSkuListResult: SkuResponseData = await reqSkuList(
    pageNo.value,
    pageSize.value,
  )
  if (reqSkuListResult.code === 200) {
    skuListData.value = reqSkuListResult.data.records
    total.value = reqSkuListResult.data.total
  }
}

// 商品上下架
const skuOnAndOffSale = async (row: SkuData) => {
  if (row.isSale == 0) {
    row.isSale = 1
  } else {
    row.isSale = 0
  }
  const reqSkuOnAndOffSaleResult = await reqSkuOnAndOffSale(
    row.isSale,
    row.id as number,
  )
  if (reqSkuOnAndOffSaleResult.code === 200) {
    ElMessage({
      type: 'success',
      message: row.isSale ? '商品上架成功' : '商品下架成功',
    })
  } else {
    ElMessage({
      type: 'error',
      message: row.isSale ? '商品上架失敗' : '商品下架失敗',
    })
  }
}

// 商品編輯
const isEdit = () => {
  ElMessage({
    type: 'success',
    message: '工程師開發中...',
  })
}

// 分頁器下拉菜單
const changePaginationSize = async (size: number) => {
  pageSize.value = size // 基本上不加這行 pagSize 也會改變
  await getHasSku()
}

onMounted(async () => {
  await getHasSku()
})
</script>
<style lang="scss" scoped>
.table {
  margin: 10px 0px;
}
.sku-img {
  width: 100%;
  height: 100%;
}
</style>
