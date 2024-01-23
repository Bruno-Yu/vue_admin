<template>
  <el-button size="small" icon="Refresh" circle @click="triggerRefresh" />
  <el-button size="small" icon="FullScreen" circle @click="triggerFullScreen" />
  <el-button size="small" icon="Setting" circle />
  <img class="user-avatar" :src="userStore.avatar" alt="userAvatar" />
  <!-- 下拉選單 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
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
<script lang="ts" setup>
// 獲取用戶資訊
import useUserStore from '@/store/modules/user';
import useLayOutSettingStore from '@/store/modules/setting'
const LayOutSettingStore = useLayOutSettingStore()

const userStore = useUserStore()


// 刷新方法
const triggerRefresh = () => {
  LayOutSettingStore.refresh = !LayOutSettingStore.refresh
}
// 全屏方法
const triggerFullScreen = () => {
  // document.fullscreenElement 若全屏則會返回 true 若非則為 null
  // 但須要注意的是全憑這種方法可能有不同瀏覽器的兼容問題 ( Chrome 有支援 )
  const isFullScreen = document.fullscreenElement
  // console.log('document.fullscreenElement', document)
  if (!isFullScreen) {
    // 利用 document 的 根結點方法去實現全屏模式
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏模式
    document.exitFullscreen()
  }
}
</script>
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
