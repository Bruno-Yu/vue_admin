<template>
  <div class="layout_container">
    <!-- 左側菜單 -->
    <div class="layout_slider">
      <Logo />
      <!-- 展示菜單 -->
      <!-- 滾動組件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜單組件 -->
        <!-- default-active 可以設置初始狀態左邊菜單是否展開，若無設置 就算你在子路由頁面上，頁面重整後，所有二級路由皆會被摺疊 -->
        <el-menu
          :default-active="$route.path"
          background-color="#001529"
          text-color="white"
          :collapse="LayoutSettingStore.fold"
        >
          <!-- :collapse="LayoutSettingStore.fold" -->
          <!-- 根據路由動態生成菜單 -->
          <Menu :menuList="userStore.menuRoutes" />
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 頂部導航 -->
    <div class="layout_tabbar" :class="{ fold: LayoutSettingStore.fold }">
      <Tabbar />
    </div>
    <!-- 內容展示區 main -->
    <div class="layout_main" :class="{ fold: LayoutSettingStore.fold }">
      <Main />
    </div>
  </div>
</template>
<script lang="ts" setup>
// 獲取路由
import { useRoute } from 'vue-router'
// 引入左側菜單的子組件 logo
import Logo from './logo/index.vue'
// 引入菜單組件
import Menu from './menu/index.vue'
// 引入右側內容展示區
import Main from './main/index.vue'
// 引入頂部導覽
import Tabbar from './tabbar/index.vue'
// 獲取 user Store
import useUserStore from '@/store/modules/user'
// 獲取 layout 倉庫
import useLayoutSettingStore from '@/store/modules/setting'

const userStore = useUserStore()
const LayoutSettingStore = useLayoutSettingStore()
const $route = useRoute()
</script>
<script lang="ts">
export default {
  name: 'Layout',
}
</script>

<style lang="scss" scoped>
.layout_container {
  width: 100vw;
  height: 100vh;
  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    color: white;
    transition: all 0.3s;
    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);
      .el-menu {
        border-right: none;
      }
    }
    &.fold {
      width: $base-menu-min-width;
    }
  }
  .layout_tabbar {
    position: fixed;
    top: 0;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    transition: all 0.3s;
    &.fold {
      left: $base-menu-min-width;
      width: calc(100% - $base-menu-min-width);
    }
  }
  .layout_main {
    position: absolute;
    top: $base-tabbar-height;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    background: yellowgreen;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
    &.fold {
      left: $base-menu-min-width;
      width: calc(100% - $base-menu-min-width);
    }
  }
}
</style>
