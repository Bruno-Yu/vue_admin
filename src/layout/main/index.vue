<template>
  <!-- 路由組件呈現位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染路由組件 -->
      <component :is="Component" />
    </transition>
  </router-view>
</template>
<script lang="ts" setup></script>
<script lang="ts">
export default {
  name: 'main',
}
</script>
<style lang="scss" scoped>
// transition vue3 類名樣式修改
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
// 過渡動畫時間設置
.fade-enter-active {
  transition: all 1s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
