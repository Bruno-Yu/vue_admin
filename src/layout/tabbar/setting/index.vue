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
        <el-dropdown-item @click="logout">退出登入</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
// 獲取用戶資訊
import useUserStore from '@/store/modules/user'
import useLayOutSettingStore from '@/store/modules/setting'
const LayOutSettingStore = useLayOutSettingStore()

const $router = useRouter()
const $route = useRoute()
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
const logout = () => {
  //  1. 需要向服務器發請求 ( 登出 api )
  //     登出同等於告知 server 本次 token 以無效
  //  2. 也需要將 pinia 內存取的數據清空 ( token, username, avatar )
  userStore.userLogout()
  //  3. 跳轉道登入頁面
  //  4. 使用 路由 query 確保登出重新登入後，頁面會與登出前一致
  $router.push({ path: '/login', query: { redirect: $route.path } })
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
