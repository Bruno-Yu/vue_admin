<template>
  <Category />
  <el-card class="table-card">
    <el-button type="primary" icon="Plus" :disabled="!categoryStore.c3Id">
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
          <el-tag class="tag" v-for="item in row.attrValueList" :key="item.id">
            {{ item.valueName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template #="{row}">
          <el-button type="warning" size="small" icon="Edit">編輯</el-button>
          <el-button type="danger" size="small" icon="Delete">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import useCategoryStore from '@/store/modules/category'
import { reqAttr } from '@/api/product/attr/index'
import type { AttrResponseData, AttrData } from '@/api/product/attr/type'
const categoryStore = useCategoryStore()
const attrData = ref<AttrData>([])

watch(
  () => categoryStore.c3Id,
  async () => {
    if (categoryStore.c3Id) {
      const result: AttrResponseData = await reqAttr(
        categoryStore.c1Id,
        categoryStore.c2Id,
        categoryStore.c3Id,
      )
      if (result.code === 200) {
        console.log('result', result)
        attrData.value = result.data
      }
    } else {
      attrData.value = []
    }
  },
)
</script>
<style lang="scss" scoped>
.table-card {
  margin: 10px 0;
}

.tag {
  margin: 5px;
}
</style>
