<!-- 動態生成菜單根據項目路由生成 -->
<template>
  <template v-for="(item, index) in menuList" :key="item.path">
    <!-- 只有一級路由 -->
    <template v-if="!item.children">
      <el-menu-item :index="item.path" v-if="item.meta.hidden">
        <template #title>
          <span>標&nbsp;</span>
          <span>
            {{ item.meta.title }}
          </span>
        </template>
      </el-menu-item>
    </template>
    <!-- 只有一個二級路由 -->
    <template v-if="item.children && item.children.length == 1">
      <el-menu-item
        :index="item.children[0].path"
        v-if="item.children[0].meta.hidden"
      >
        <template #title>
          <span>標&nbsp;</span>
          <span>
            {{ item.children[0].meta.title }}
          </span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有多個二級路由 -->
    <template></template>
    <el-sub-menu
      :index="item.path"
      v-if="item.children && item.children.length > 1"
    >
      <template #title>
        <span>{{ item.meta.title }}</span>
      </template>
      <!-- 利用遞迴本身組件，做到多層路由展示 -->
      <Menu :menuList="item.children" />
    </el-sub-menu>
  </template>
</template>
<script lang="ts" setup>
// 獲取父祖件傳遞過來的全部路由的數據
defineProps(['menuList'])
</script>

<script lang="ts">
export default {
  name: 'Menu',
}
</script>

<style lang="scss" scoped></style>
