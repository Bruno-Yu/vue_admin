<template>
  <el-card>
    <el-form :inline="true" class="d-flex justify-between">
      <el-form-item label="角色名稱:" class="mb-0">
        <el-input v-model="userInput" placeholder="請輸入用戶名" />
      </el-form-item>
      <el-form-item class="mb-0">
        <el-button
          type="primary"
          :disabled="!userInput.trim()"
          @click="searchRoleName"
        >
          搜索
        </el-button>
        <el-button type="secondary" class="btn" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card class="table">
    <el-button type="primary" icon="Plus" @click="showAddOrEditRoleDrawer">
      添加角色
    </el-button>
    <el-table class="table" :data="rolesData" border>
      <el-table-column type="index" label="#" align="center" />
      <el-table-column prop="id" label="id" align="center" />
      <el-table-column
        prop="roleName"
        label="角色名稱"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        prop="createTime"
        label="創建時間"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        prop="updateTime"
        label="更新時間"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row }">
          <el-button type="primary" size="small" icon="User">
            分配權限
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="showAddOrEditRoleDrawer(row)"
          >
            編輯
          </el-button>
          <el-popconfirm
            :title="`您確定要刪掉 ${row.roleName} 嗎?`"
            icon="Delete"
            icon-color="#f56c6c"
            width="250px"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">
                刪除
              </el-button>
            </template>
          </el-popconfirm>
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
      @current-change="getRolesData"
      @size-change="getRolesData(1)"
    />
  </el-card>
  <el-dialog v-model="editOrAddRoleDrawerIsVisible">
    <template #header>
      <h3>{{ currentRole.id ? '更新' : '新增' }}</h3>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="角色名稱">
          <el-input v-model="currentRole.roleName" placeholder="輸入角色名稱" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button type="secondary">取消</el-button>
      <el-button type="primary" class="btn">確定</el-button>
    </template>
  </el-dialog>
  <el-drawer>
    <template #header>
      <h4>分配用戶權限</h4>
    </template>
    <template #default></template>
  </el-drawer>
</template>
<script lang="ts" setup>
import useLayoutSettingStore from '@/store/modules/setting'
import { ref, onMounted, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { reqRolesData } from '@/api/acl/role'
import type { RoleData, RolesDataResponse } from '@/api/acl/role/type'

// 獲取 setting store instance
const settingStore = useLayoutSettingStore()

// 分頁器
const pageNo = ref<number>(1)
// 每頁幾筆數據
const pageSize = ref<number>(10)
// sku total number
const total = ref<number>(0)

// 用戶角色存取
const userInput = ref<string>('')

// 存取目前選取角色
const currentRole = ref<RoleData>({})

// 存取此頁所有 rolesData
const rolesData = ref<RoleData[]>([])

// 重置按鈕功能
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}

const searchRoleName = async () => {
  if (!userInput.value.trim()) {
    ElMessage({
      type: 'error',
      message: '搜尋欄不得為空',
    })
  } else {
    // 搜尋角色名稱
    await getRolesData(1, userInput.value)
  }
}

const getRolesData = async (page: number = 1, rolename: string = '') => {
  pageNo.value = page
  const ReqRolesDataResult = await reqRolesData(
    pageNo.value,
    pageSize.value,
    rolename,
  )
  if (ReqRolesDataResult.code === 200) {
    const { records, total: apiTotal } = ReqRolesDataResult.data
    rolesData.value = records
    total.value = apiTotal
  }
}

// 新增或是分類角色權限
const editOrAddRoleDrawerIsVisible = ref<boolean>(false)

const showAddOrEditRoleDrawer = (row: RoleData) => {
  if (row.id) {
    currentRole.value = row
  }
  // if(row.id){
  //   }
  editOrAddRoleDrawerIsVisible.value = true
}

onMounted(async () => {
  // 獲取所有 user data
  await getRolesData()
})
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
