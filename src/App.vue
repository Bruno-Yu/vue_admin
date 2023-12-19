<script setup lang="ts">
// 引入圖標組件
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import Test from '@/components/test.vue'
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
    <el-button type="primary" :icon="Plus">增加按鈕</el-button>
    <el-button type="success" :icon="Edit">編輯按鈕</el-button>
    <el-button type="danger" :icon="Delete">刪除按鈕</el-button>
    <hr />
    <div class="demo-pagination-block">
      <div class="demonstration text-color">Total item count</div>
      <el-pagination
        :page-size="100"
        layout="total, prev, pager, next"
        :total="1000"
      />
    </div>
    <Test />
    <hr />
    <h2>SVG 測試</h2>
    <SvgIcon name="home" color="hotpink" width="30px" height="30px" />
    <Pagination />
    <hr />
    <h2>測試axios二次封裝</h2>
  </div>
</template>

<style lang="scss" scoped>
.text-color {
  color: $color;
}
</style>
