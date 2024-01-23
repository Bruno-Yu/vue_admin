<template>
  <div>home</div>
</template>
<script lang="ts" setup>
//  引入組合式 API 函數之生命週期函數
import { onMounted } from 'vue'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()

// 首頁掛載完畢時發請求用以獲取用戶信息
onMounted(() => {
  userStore.userInfo()
})
</script>
<style lang="scss" scoped></style>
