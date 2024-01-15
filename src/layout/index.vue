<template>
  <div class="layout_container">
    <!-- 左側菜單 -->
    <div class="layout_slider">123</div>
    <!-- 頂部導航 -->
    <div class="layout_tabbar">456</div>
    <!-- 內容展示區 -->
    <div class="layout_main">
      <p style="height: 1000000px; background: red">12345</p>
    </div>
  </div>
</template>
<script lang="ts" setup></script>
<style lang="scss" scoped>
.layout_container {
  width: 100vw;
  height: 100vh;
  background: green;
  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
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
