<template>
  <div class="logo">
    <img :src="setting.logo" alt="logo" v-if="!setting.logoHidden" />
    <p>{{ setting.title }}</p>
  </div>
</template>
<script lang="ts" setup>
// 引入設置標題與 logo 的配置文件
import setting from '@/setting'
</script>
<style lang="scss" scoped>
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: white;
  display: flex;
  align-items: center;
  padding: 20px;
  img {
    width: 40px;
    height: 40px;
  }
  p {
    font-size: $base-menu-title-fontSize;
    margin-left: 10px;
  }
  // border: 1px solid white;
}
</style>
