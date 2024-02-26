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
          <el-button
            type="info"
            size="small"
            icon="InfoFilled"
            @click="showDetail(row)"
          />
          <el-popconfirm
            :title="`您確定要刪掉 ${row.skuName} 嗎?`"
            icon="Delete"
            icon-color="#f56c6c"
            width="250px"
            @confirm="deleteSKU(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete" />
            </template>
          </el-popconfirm>
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
    <!-- 展示商品詳情 -->
    <!-- 
      el-drawer 
      v-model 與 el-dialog 一樣控制 drawer 的展示與否
      direction drawer 出現的方向，默認是 rtl

    -->
    <el-drawer v-model="isDrawerVisible">
      <template #header>
        <h4>查看商品詳情</h4>
      </template>
      <template #default>
        <el-row class="table">
          <el-col :span="6">名稱</el-col>
          <el-col :span="18">{{ skuDemoData.skuName }}</el-col>
        </el-row>
        <el-row class="table">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuDemoData.skuDesc }}</el-col>
        </el-row>
        <el-row class="table">
          <el-col :span="6">價格</el-col>
          <el-col :span="18">{{ skuDemoData.price }}</el-col>
        </el-row>
        <el-row class="table">
          <el-col :span="6">平台屬性</el-col>
          <el-col :span="18">
            <el-tag
              class="tag"
              v-for="tag in skuDemoData.skuAttrValueList"
              :key="tag.attrId"
            >
              {{ tag.attrName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row class="table">
          <el-col :span="6">銷售屬性</el-col>
          <el-col :span="18">
            <el-tag
              class="tag"
              v-for="tag in skuDemoData.skuSaleAttrValueList"
              :key="tag.saleAttrValueId"
            >
              {{ tag.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row class="table">
          <el-col :span="6">商品圖片</el-col>
          <el-col :span="18">
            <!-- 圖片 -->
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="tag in skuDemoData.skuImageList"
                :key="tag.id"
              >
                <img class="sku-img" :src="tag.imgUrl" :alt="tag.imgName" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus' // element 中用來呈現 api 訊息的組件
import {
  reqSkuList,
  reqSkuOnAndOffSale,
  reqShowSku,
  reqDeleteSku,
} from '@/api/product/sku'
import type {
  SkuResponseData,
  SkuData,
  SkuShowResponseData,
} from '@/api/product/sku/type'
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

// 商品檢視
// 商品檢視資料
const skuDemoData = ref<SkuData>({
  id: 0,
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
  isSale: 0, //  0: 下架; 1: 上架
  skuImageList: [],
})
// 商品檢視頁面的呈現與否
const isDrawerVisible = ref<boolean>(false)
// 按鈕方法
const showDetail = async (row: SkuData) => {
  isDrawerVisible.value = true
  const resultReqShowSku: SkuShowResponseData = await reqShowSku(
    row.id as number,
  )
  if (resultReqShowSku.code === 200) {
    skuDemoData.value = resultReqShowSku.data
  }
}
// 刪除 SKU
const deleteSKU = async (skuId: number) => {
  const result = reqDeleteSku(skuId)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '刪除成功',
    })
    await getHasSku(
      skuListData.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '系統數據不能刪除',
    })
  }
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
.tag {
  margin: 5px;
}

// 輪播
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
