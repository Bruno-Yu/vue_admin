<template>
  <el-button size="small" icon="Refresh" circle />
  <el-button size="small" icon="FullScreen" circle />
  <el-button size="small" icon="Setting" circle />
  <img class="user-avatar" src="../../../../public/logo.png" alt="userAvatar" />
  <el-dropdown>
    <span class="el-dropdown-link">
      Admin
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>退出登入</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts" setup></script>
<script lang="ts">
export default {
  name: 'Setting',
}
</script>
<style lang="scss" scoped>
.user-avatar {
  margin: 0 10px;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
