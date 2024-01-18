<template>
  <!-- 路由組件呈現位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染路由組件 -->
      <component :is="Component" v-if="isVisible" />
    </transition>
  </router-view>
</template>
<script lang="ts" setup>
import { watch, ref, nextTick } from 'vue'
import useLayoutSettingStore from '@/store/modules/setting'
const LayoutSettingStore = useLayoutSettingStore()

// 控制當前組件看是否銷毀後重建
const isVisible = ref(true)

// 監聽 LayoutSettingStore.refresh 看是否發生變化，如若發生變化就說明用戶有點擊刷新按鈕
watch(
  () => LayoutSettingStore.refresh,
  () => {
    // 點擊後銷毀
    isVisible.value = false
    // 再創建
    // 利用 nextTick 因為 nextTick 能夠獲取渲染完後的 DOM，
    // 也就是當 DOM 因觸發被拿掉渲染完後 nextTick 被觸發，再重新改變 isVisible 使其呈現
    nextTick(() => {
      isVisible.value = true
    })
  },
)
</script>
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
