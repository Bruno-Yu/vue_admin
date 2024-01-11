<script setup lang="ts">
import { onMounted } from 'vue'
import { reqLogin } from './api/user'

onMounted(() => {
  reqLogin({ username: 'admin', password: '123456' })
})
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
.text-title {
  font-size: 3rem;
  font-weight: bold;

  // color: $color;
}
</style>
