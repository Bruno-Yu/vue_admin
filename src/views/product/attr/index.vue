<template>
  <Category :scene="currentScene" />
  <el-card class="table-card">
    <div v-show="currentScene === 0">
      <el-button
        @click="addAttr"
        type="primary"
        icon="Plus"
        :disabled="!categoryStore.c3Id"
      >
        添加屬性
      </el-button>
      <el-table border class="table-card" :data="attrData">
        <el-table-column
          label="序號"
          type="index"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="屬性名稱"
          width="200px"
          prop="attrName"
        ></el-table-column>
        <el-table-column label="屬性值名稱">
          <template #="{ row }">
            <el-tag
              class="tag"
              v-for="item in row.attrValueList"
              :key="item.id"
            >
              {{ item.valueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <!-- row 為 屬性對象 -->
          <template #="{ row }">
            <el-button
              type="warning"
              size="small"
              icon="Edit"
              @click="updateAttr(row)"
            >
              編輯
            </el-button>

            <el-popconfirm
              :title="`您確定要刪掉 ${row.valueName}屬性嗎?`"
              icon="Delete"
              icon-color="#f56c6c"
              width="250px"
              @confirm="deleteAttr(row.id)"
            >
              <template #reference>
                <el-button type="danger" size="small" icon="Delete">
                  刪除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="currentScene === 1">
      <!-- 添加 & 編輯 屬性 -->
      <el-form :inline="true">
        <el-form-item label="屬性名稱">
          <el-input
            placeholder="請你輸入屬性的名稱"
            v-model="attrParams.attrName"
          />
        </el-form-item>
      </el-form>
      <el-button
        :disabled="attrParams.attrName.trim() === ''"
        type="primary"
        icon="Plus"
        @click="addAttrValue"
      >
        添加屬性值
      </el-button>
      <el-button>取消</el-button>
      <el-table border :data="attrParams.attrValueList" class="table-card">
        <el-table-column
          label="序號"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column label="屬性值名稱">
          <template #="{ row, $index }">
            <el-input
              size="small"
              :ref="(vc: any) => (inputArray[$index] = vc)"
              v-if="row.isEditing"
              @blur="stopEdit(row, $index)"
              v-model="row.valueName"
              placeholder="請輸入屬性值名稱"
            />
            <div v-else @click="requestEdit(row, $index)">
              {{ row.valueName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="屬性值操作">
          <template #="{ row, $index }">
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="attrParams.attrValueList.splice($index, 1)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        @click="save"
        :disabled="attrParams.attrName.trim() === ''"
      >
        保存
      </el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import { ref, watch, reactive, nextTick, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import useCategoryStore from '@/store/modules/category'
import {
  reqAttr,
  reqAddOrUpdateAttr,
  reqDeleteAttr,
} from '@/api/product/attr/index'
import type {
  AttrResponseData,
  AttrData,
  AttrValueData,
} from '@/api/product/attr/type'
const categoryStore = useCategoryStore()
const attrData = ref<AttrData>([])

const getAttr = async () => {
  if (categoryStore.c3Id) {
    const result: AttrResponseData = await reqAttr(
      categoryStore.c1Id,
      categoryStore.c2Id,
      categoryStore.c3Id,
    )
    if (result.code === 200) {
      attrData.value = result.data
    }
  } else {
    attrData.value = []
  }
}

watch(
  () => categoryStore.c3Id,
  async () => {
    await getAttr()
  },
)

// 定義卡片組件內容切換的變量
const currentScene = ref<number>(0) //0 展示值 ; 1 添加值
// 新增屬性數據
const attrParams = reactive<AttrData>({
  attrName: '', // 屬性名稱
  attrValueList: [], // 新增 tag 數據
  categoryId: '', // 三級分類的 id
  categoryLevel: 3, // 分類級別
})

// 添加屬性按鈕
const addAttr = () => {
  // 先清空原添加頁面的數據
  // 注意這寫法，之所以不用變數去指向此清空物件主要是會有內部物件傳參考問題，
  // 但用這方式就不會有巢狀物件傳參考的問題
  Object.assign(attrParams, {
    attrName: '', // 屬性名稱
    attrValueList: [], // 新增 tag 數據
    categoryId: '', // 三級分類的 id
    categoryLevel: 3, // 分類級別
  })
  attrParams.categoryId = categoryStore.c3Id // 點擊新增或編輯需要的第三級分類 id
  currentScene.value = 1
}

const updateAttr = async (row: AttrData) => {
  // row 是屬性內容
  // 要注意因為傳參考，所以需要注意的是雖按取消存取，但其仍會儲存
  // 或者使用 structuredClone() 實現深拷貝
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
  currentScene.value = 1
}
const deleteAttr = async (id: number) => {
  const result = await reqDeleteAttr(id)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '刪除成功',
    })
    await getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '刪除失敗',
    })
  }
}

// 取消新增
const cancel = () => {
  currentScene.value = 0
}

// 確認新增
const save = async () => {
  // 刪去空的屬性值
  attrParams.attrName = attrParams.attrName.trim()
  attrParams.attrValueList = attrParams.attrValueList.filter(
    (attr) => attr.valueName !== '',
  )
  if (attrParams.attrName) {
    const result = await reqAddOrUpdateAttr(attrParams)
    if (result.code === 200) {
      currentScene.value = 0
      ElMessage({
        type: 'success',
        message: attrParams.id ? '修改成功' : '添加成功',
      })
      await getAttr()
    } else {
      ElMessage({
        type: 'error',
        message: attrParams.id ? '修改失敗' : '添加失敗',
      })
    }
  } else {
    // 若無屬性名稱不給存取
    ElMessage({
      type: 'error',
      message: '屬性名稱不得為空',
    })
  }
}

// 屬性值 (el-input) array
const inputArray = ref<AttrValueData[]>([])

// ref 綁定的函式，會因為 html element 結構的變化而被觸發
const handler = (element: any) => {
  console.log('ref 被觸發', element)
}

// 添加屬性值(tag)
const addAttrValue = () => {
  // 確認目前欄位沒有空值屬性要加再加
  const foundTarget = attrParams.attrValueList.find(
    (attr) => attr?.valueName === '',
  )
  if (foundTarget) {
    ElMessage({
      type: 'error',
      message: '已有新增欄位',
    })
  } else {
    attrParams.attrValueList.push({
      valueName: '',
      isEditing: true, // 確認目前欄位是否是編輯模式
    })
    // 自動聚焦最後一個
    nextTick(() => {
      // 在 instance 上使用 focus 可以手動聚焦
      inputArray.value[attrParams.attrValueList.length - 1].focus()
    })
  }
}
// input blur 行為 ( 非 focused 時 )
const stopEdit = (row: AttrValueData, $index: number) => {
  row.valueName = row.valueName.trim()
  // 不能為空字串
  if (row.valueName === '') {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '屬性值不得為空',
    })
    return
  }
  // 不能有重複值
  const foundTarget = attrParams.attrValueList.find((attr) => {
    // 把自己扣出去 ( 不能自己與自己比較 )
    if (attr !== row) {
      return attr.valueName === row.valueName.trim()
    }
  })
  // 若有找到同樣的屬性值也不允許新增
  if (foundTarget) {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '屬性值不得重複',
    })
    return
  }
  row.isEditing = false
}
const requestEdit = (row: AttrValueData, $index: number) => {
  row.isEditing = true
  // 因為這邊是用 v-if 若直接拿取( 未用  nextTick 的話 )會因為組件尚未渲染所以會得到 null
  // nextTick(() => {
  //   console.log('inputArray[$index]', inputArray.value[$index])
  // })
}

// 在轉頁 vue 要銷毀此分頁的元件時，記得要將 pinia 中存取的數據移除
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
</style>
