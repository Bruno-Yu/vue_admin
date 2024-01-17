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
        >
          <!-- 根據路由動態生成菜單 -->
          <Menu :menuList="userStore.menuRoutes" />
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 頂部導航 -->
    <div class="layout_tabbar">456</div>
    <!-- 內容展示區 main -->
    <div class="layout_main">
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
// 獲取 user Store
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const $route = useRoute()
</script>
<style lang="scss" scoped>
.layout_container {
  width: 100vw;
  height: 100vh;
  background: green;
  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);
      .el-menu {
        border-right: none;
      }
    }
  }
  .layout_tabbar {
    position: fixed;
    top: 0;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    background: cyan;
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
  }
}
</style>
