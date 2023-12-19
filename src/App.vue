<script setup lang="ts">
// import request from '@/utils/request'
import { onMounted } from 'vue'
import { reqLogin } from './api/user'
// import SvgIcon from '@/components/SvgIcon/index.vue'

onMounted(() => {
  // request({
  //   url: '/user/login',
  //   method: 'post',
  //   data: {
  //     username: 'admin',
  //     password: '123456',
  //   },
  // }).then((res) => {
  //   console.log(res)
  // })
  reqLogin({ username: 'admin', password: '123456' })
})
</script>

<template>
  <div>
    <h1>我是 APP 根組件</h1>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
.text-color {
  color: $color;
}
</style>
