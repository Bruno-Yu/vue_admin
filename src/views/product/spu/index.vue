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
                @click="addSku(row)"
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
                @click="openSkuList(row)"
              />
              <el-popconfirm
                :title="`您確定要刪掉 ${row.spuName} 嗎?`"
                icon="Delete"
                icon-color="#f56c6c"
                width="250px"
                @confirm="deleteSPU(row.id)"
              >
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete" />
                </template>
              </el-popconfirm>
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
      <SkuForm ref="skuForm" v-show="scene === 2" @changeScene="changeScene" />
      <!-- 展示選定 SPU 下所有的 SKU 數據 -->
      <el-dialog title="SKU 列表" v-model="skuDialogVisible">
        <el-table :data="currentSkuList" border>
          <el-table-column prop="skuName" label="sku 名字" />
          <el-table-column prop="price" label="sku 價格" />
          <el-table-column prop="weight" label="sku 重量" />
          <el-table-column label="sku 圖片">
            <template #="{ row }">
              <img
                :src="row.skuDefaultImg"
                :alt="`${row.skuName}'s image'`"
                class="img-preview"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>
<script lang="ts">
export default {
  name: 'SPU',
}
</script>
<script lang="ts" setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus' // element 中用來呈現 api 訊息的組件
// 引入 category store
import useCategoryStore from '@/store/modules/category'
import { reqHasSpu, reqSkuInfo, reqDeleteSpu } from '@/api/product/spu'
import type {
  HasSpuResponseData,
  Records,
  SpuData,
  SkuInfoData,
  SkuData,
} from '@/api/product/spu/type'
// 引入sku spu 新增編輯組件
import SkuForm from './skuForm.vue'
import SpuForm from './spuForm.vue'

const categoryStore = useCategoryStore()

// 定義 category 中的 scene ( 0:顯示已有的 SPU 數據; 1:添加或修改 SPU; 2: 添加 SKU  )
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

// 獲取子組件 sluForm
const skuForm = ref()
// 在該 SPU 下新增 SKU
const addSku = (row: SpuData) => {
  scene.value = 2
  skuForm.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
// 存取目前 SPU 所檢視的所有 sku
const currentSkuList = ref<SkuData[]>([])
// 控制 SKU 列表 Dialogue
const skuDialogVisible = ref<boolean>(false)
// 檢視該 spu 下的 sku
const openSkuList = async (row: SpuData) => {
  const reqSkuInfoResult: SkuInfoData = await reqSkuInfo(row.id as number)
  if (reqSkuInfoResult.code === 200) {
    currentSkuList.value = reqSkuInfoResult.data
    skuDialogVisible.value = true
  }
}

//  scene 轉換到新增或編輯 SPU 頁面
const addOrEditSPUScene = (
  isAdd: boolean = false,
  row: SpuData | undefined = undefined,
) => {
  scene.value = 1
  if (!isAdd) {
    // 更新
    // 調用子組件的方法獲取 api 資料
    spuForm.value.initHasSpuData(row)
  } else {
    // 新增則不傳入已有的資料 row 但要傳入 c3Id
    spuForm.value.initHasSpuData(undefined, categoryStore.c3Id)
  }
}

// 刪除 SPU
const deleteSPU = async (spuId: string | number) => {
  const deleResult = await reqDeleteSpu(spuId)
  if (deleResult.code === 200) {
    ElMessage({
      type: 'success',
      message: '刪除成功',
    })
    await getHasSpu(
      recordsData.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '刪除失敗',
    })
  }
}

// changeScene 讓子組件通知父組件切換 scene 所用
const changeScene = (EmitScene: { sceneNo: number; action: string }) => {
  const { sceneNo, action } = EmitScene
  scene.value = sceneNo
  // 確認是否有三級分類 id
  if (categoryStore.c3Id) {
    // 如果更新 & 取消就留在當前頁面(預設)，如果是新增就留在第一頁
    if (action === 'add') {
      getHasSpu(1)
    } else {
      getHasSpu(pageNo.value)
    }
  }
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
// 離開時清空 store 中的數據
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>
<style lang="scss" scoped>
.table-card {
  margin: 10px 0;
}

.tag {
  margin: 5px;
}

.img-preview {
  height: 100%;
  width: 100%;
}
</style>
