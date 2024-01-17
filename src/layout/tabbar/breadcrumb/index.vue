<template>
  <!-- 展開 -->
  <el-icon class="mr-2" @click="changeIcon">
    <component :is="LayoutSettingStore.fold ? 'Fold' : 'Expand'" />
  </el-icon>
  <!-- 左側麵包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 動態麵包屑 -->
    <!-- breadcrumb 的 to 可以轉換路由 -->
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <!-- 圖標 -->
      <el-icon class="align-middle">
        <component :is="item.meta.icon" />
      </el-icon>
      <span class="mx-1 align-middle">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'
import useLayoutSettingStore from '@/store/modules/setting.ts'
const LayoutSettingStore = useLayoutSettingStore()
const $route = useRoute()
// 點擊圖標的方法
const changeIcon = () => {
  // 圖標切換
  LayoutSettingStore.fold = !LayoutSettingStore.fold
}
// const handler = () => {
//   // $route.matched 內含目前的一級 & 二級路由，以陣列回傳
//   console.log('$route', $route.matched)
// }
</script>
<script lang="ts">
export default {
  name: 'Breadcrumb',
}
</script>
<style lang="scss" scoped>
.mr-2 {
  margin-right: 10px;
}
.align-middle {
  vertical-align: middle;
}
.mx-1 {
  margin: 0 4px;
}
</style>
