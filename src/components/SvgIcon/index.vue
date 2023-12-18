<script setup lang="ts">
// 接收父組件傳遞過來的參數
defineProps({
  // xlink:href 屬性值的前綴
  prefix: {
    type: String,
    default: '#icon-',
  },
  // 提供使用圖標名
  name: String,
  color: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '16px',
  },
  height: {
    type: String,
    default: '16px',
  },
})
</script>

<template>
  <div>
    <!-- svg: 是 svg 圖片的外層容器節點，內不需要搭配 use 標籤結合使用 -->
    <svg :style="{ width, height }">
      <!-- xlink:href 指定執行哪一個圖標其值務必以 #icon-圖標名稱使用 -->
      <!-- 在 use 中設置 fill 可以改變圖標的顏色 -->
      <!-- 要 fill 改顏色有用記得將 svg 中的 path 不能有 fill 屬性，這邊才改的動 -->
      <use :xlink:href="prefix + name" :fill="color"></use>
    </svg>
  </div>
</template>

<style scoped></style>
