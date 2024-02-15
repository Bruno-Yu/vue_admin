<template>
  <div>
    <!-- 三級分類 -->
    <Category :scene="scene"></Category>
    <el-card class="table-card">
      <!-- 預設頁面 -->
      <!-- 這邊不用 v-if 是因為其會銷毀&重建組件 -->
      <div v-show="scene === 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="!categoryStore.c3Id"
          @click="addOrEditSPUScene(true)"
        >
          添加SPU
        </el-button>
        <el-table class="table-card" border :data="recordsData">
          <el-table-column
            label="序號"
            type="index"
            align="center"
            width="80px"
          />
          <el-table-column label="SPU名稱" prop="spuName" />
          <!-- show-overflow-tooltip 可以縮減過多的內容並以 ... 表示 -->
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          />
          <el-table-column label="SPU操作">
            <!-- row 即為原有的 spu 個別項目(物件) -->
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
              />
              <el-button
                type="warning"
                size="small"
                icon="Edit"
                title="編輯SPU"
                @click="addOrEditSPUScene(false, row)"
              />
              <el-button
                type="info"
                size="small"
                icon="View"
                title="查看SKU列表"
              />
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                title="刪除SPU"
              />
            </template>
          </el-table-column>
        </el-table>
        <!-- 分頁器 -->
        <el-pagination
          :disabled="!categoryStore.c3Id"
          v-model:current-page="pageNo"
          :page-sizes="[3, 5, 7, 9]"
          v-model:page-size="pageSize"
          layout="prev, pager, next, jumper,->,sizes,total"
          :background="true"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>
      <!-- 添加/修改 SPU -->
      <SpuForm ref="spuForm" v-show="scene === 1" @changeScene="changeScene" />
      <!-- 添加 SKU -->
      <SkuForm v-show="scene === 2" />
    </el-card>
  </div>
</template>
<script lang="ts">
export default {
  name: 'SPU',
}
</script>
<script lang="ts" setup>
import { ref, watch } from 'vue'
// 引入 category store
import useCategoryStore from '@/store/modules/category'
import { reqHasSpu } from '@/api/product/spu'
import type {
  HasSpuResponseData,
  Records,
  SpuData,
} from '@/api/product/spu/type'
// 引入sku spu 新增編輯組件
import SkuForm from './skuForm.vue'
import SpuForm from './spuForm.vue'

const categoryStore = useCategoryStore()

// 定義 category 中的 scene ( 0:顯示已有的 SPU 數據; 1:添加或修改 SPU; 3: 添加 SKU  )
const scene = ref<number>(0)
// 分頁器
const pageNo = ref<number>(1)
// 每頁幾筆數據
const pageSize = ref<number>(3)
// spu data
const recordsData = ref<Records>([])
// spu total number
const total = ref<number>(0)
// 獲取子組件 spuForm
const spuForm = ref()

//  scene 轉換到新增或編輯 SPU 頁面
const addOrEditSPUScene = (
  isAdd: boolean = false,
  row: SpuData | undefined = undefined,
) => {
  scene.value = 1
  if (!isAdd) {
    // 調用子組件的方法獲取 api 資料
    spuForm.value.initHasSpuData(row)
  }
}

// changeScene 讓子組件通知父組件切換 scene 所用
const changeScene = (EmitScene: number) => {
  scene.value = EmitScene
}

// 監聽三級分類 id 的變化
watch(
  () => categoryStore.c3Id,
  () => {
    // 確認是否有三級分類 id
    if (categoryStore.c3Id) {
      getHasSpu()
    }
  },
)

// 獲取三級分類下的 SPU
const getHasSpu = async (page = 1) => {
  // 修改當前的頁碼
  pageNo.value = page
  const result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code === 200) {
    recordsData.value = result.data.records
    total.value = result.data.total
  }
}
// 分頁器比數選單發生變化時觸發
const changeSize = () => {
  getHasSpu()
}
</script>
<style lang="scss" scoped>
.table-card {
  margin: 10px 0;
}

.tag {
  margin: 5px;
}
</style>
