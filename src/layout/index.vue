<template>
  <div class="layout_container">
    <!-- 左側菜單 -->
    <div class="layout_slider">
      <Logo />
      <!-- 展示菜單 -->
      <!-- 滾動組件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜單組件 -->
        <el-menu background-color="#001529" text-color="white">
          <!-- 根據路由動態生成菜單 -->
          <Menu :menuList="userStore.menuRoutes" />
          <!-- <el-menu-item index="1">首頁</el-menu-item>
          <el-menu-item index="2">數據大屏</el-menu-item>
          <el-sub-menu index="3">
            <template #title>
              <span>權限管理</span>
            </template>
            <el-menu-item index="3-1">用戶管理</el-menu-item>
            <el-menu-item index="3-2">角色管理</el-menu-item>
            <el-menu-item index="3-3">菜單管理</el-menu-item>
          </el-sub-menu> -->
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 頂部導航 -->
    <div class="layout_tabbar">456</div>
    <!-- 內容展示區 -->
    <div class="layout_main">
      <p style="height: 1000000px; background: red">12345</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
// 引入左側菜單的子組件 logo
import Logo from './logo/index.vue'
// 引入菜單組件
import Menu from './menu/index.vue'
// 獲取 user Store
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
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
