<template>
  <div>
    <!-- 三級分類組件 -->
    <el-card>
      <el-form :inline="true">
        <el-form-item label="一級分類">
          <el-select
            :disabled="!!scene"
            v-model="categoryStore.c1Id"
            @change="categoryStore.getC2"
          >
            <!-- option label 為顯示的數據; value 則為 select 所選定的數據 -->
            <el-option
              v-for="c1 in categoryStore.c1Arr"
              :key="c1.id"
              :label="c1.name"
              :value="c1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二級分類">
          <el-select
            :disabled="!!scene"
            v-model="categoryStore.c2Id"
            @change="categoryStore.getC3"
          >
            <el-option
              v-for="c2 in categoryStore.c2Arr"
              :key="c2.id"
              :label="c2.name"
              :value="c2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三級分類">
          <el-select :disabled="!!scene" v-model="categoryStore.c3Id">
            <el-option
              v-for="c3 in categoryStore.c3Arr"
              :key="c3.id"
              :label="c3.name"
              :value="c3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script lang="ts">
export default {
  name: 'Category',
}
</script>
<script lang="ts" setup>
import { onMounted } from 'vue'
import useCategoryStore from '@/store/modules/category'
// import { reqC1, reqC2, reqC3 } from '@/api/product/attr/index.ts'

defineProps(['scene'])

const categoryStore = useCategoryStore()
// const c1Arr = ref([])
// const c1Id = ref<number | string>('')

// const getC1 = async () => {
//   const result = await reqC1()
//   if (result.code === 200) {
//     c1Arr.value = result.data
//   }
// }

onMounted(async () => {
  // await getC1()
  await categoryStore.getC1()
})
</script>
<style lang="scss" scoped></style>
