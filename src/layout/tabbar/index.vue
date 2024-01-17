<template>
  <div class="tabbar">
    <dev class="tabbar_left">
      <Breadcrumb />
    </dev>
    <dev class="tabbar_right">
      <Setting />
    </dev>
  </div>
</template>
<script lang="ts" setup>
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
</script>
<script lang="ts">
export default {
  name: 'Tabbar',
}
</script>
<style lang="scss" scoped>
.tabbar {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  color: black;
  background-image: linear-gradient(to bottom, white, rgb(233, 231, 231));
  .tabbar_left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  .tabbar_right {
    display: flex;
    align-items: center;
  }
}
</style>
