<template>
  <el-card>
    <el-form :inline="true" class="d-flex justify-between">
      <el-form-item label="用戶名:" class="mb-0">
        <el-input placeholder="請輸入用戶名" />
      </el-form-item>
      <el-form-item class="mb-0">
        <el-button type="primary">搜索</el-button>
        <el-button type="secondary" class="btn">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card class="table">
    <el-button type="primary">添加用戶</el-button>
    <el-button type="danger" class="btn">批量刪除</el-button>
    <el-table class="table" border>
      <el-table-column type="selection" align="center" />
      <el-table-column type="index" label="#" align="center" />
      <el-table-column label="id" align="center" />
      <el-table-column label="用戶名稱" align="center" />
      <el-table-column label="用戶角色" align="center" />
      <el-table-column label="創建時間" align="center" />
      <el-table-column label="更新時間" align="center" />
      <el-table-column label="操作" width="260px" align="center">
        <template #="{row}">
          <el-button type="primary" size="small">分配角色</el-button>
          <el-button type="primary" size="small" icon="Edit">編輯</el-button>
          <el-button type="primary" size="small" icon="Delete">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      :page-sizes="[10, 20, 30, 40]"
      v-model:page-size="pageSize"
      layout="prev, pager, next, jumper,->,sizes,total"
      :background="true"
      :total="total"
    />
  </el-card>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
// 分頁器
const pageNo = ref<number>(1)
// 每頁幾筆數據
const pageSize = ref<number>(5)
// sku total number
const total = ref<number>(0)
</script>
<style lang="scss" scoped>
.btn {
  margin-left: 10px;
}
.d-flex {
  display: flex;
}
.mb-0 {
  margin-bottom: 0;
}
.table {
  margin: 10px 0;
}
.justify-between {
  justify-content: space-between;
}
</style>
