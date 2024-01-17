<!-- 動態生成菜單根據項目路由生成 -->
<template>
  <template v-for="(item, index) in menuList" :key="item.path">
    <!-- 只有一級路由, 沒子路由 -->
    <template v-if="!item.children">
      <el-menu-item
        :index="item.path"
        v-if="!item.meta.hidden"
        @click="goRoute"
      >
        <!-- 注意: el-icon 放在 title 外，是方便 side menu 摺疊時顯示 icon -->
        <el-icon>
          <!-- 用動態組件帶入圖標 -->
          <component :is="item.meta.icon" />
        </el-icon>
        <template #title>
          <span>
            {{ item.meta.title }}
          </span>
        </template>
      </el-menu-item>
    </template>
    <!-- 只有一個子路由 -->
    <template v-if="item.children && item.children.length == 1">
      <el-menu-item
        :index="item.children[0].path"
        v-if="!item.children[0].meta.hidden"
        @click="goRoute"
      >
        <el-icon>
          <component :is="item.children[0].meta.icon" />
        </el-icon>
        <template #title>
          <span>
            {{ item.children[0].meta.title }}
          </span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有多個子路由 -->
    <el-sub-menu
      :index="item.path"
      v-if="item.children && item.children.length > 1"
    >
      <!-- 注意:多個子路由部分 el-icon 仍是放在 title 內 -->
      <template #title>
        <el-icon>
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <!-- 利用遞迴本身組件，做到多層路由展示 -->
      <Menu :menuList="item.children" />
    </el-sub-menu>
  </template>
</template>
<script lang="ts" setup>
// 獲取父祖件傳遞過來的全部路由的數據
defineProps(['menuList'])
import { useRouter } from 'vue-router'
//  獲取路由函式
const $router = useRouter()

// 點擊菜單的導航行為
const goRoute = (vc) => {
  // el-menu-item 點擊後的 event 可以拿到對應的 index ( 我們在這邊將 index 設成對應的路由路徑 )
  $router.push(vc.index)
}
</script>

<script lang="ts">
// 注意 這邊另一個 script language 必須相同
// 注意: 若沒標註這，遞迴可能不會成功
export default {
  name: 'Menu',
}
</script>

<style lang="scss" scoped></style>
