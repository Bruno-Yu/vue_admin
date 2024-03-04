<template>
  <el-card>
    <el-form :inline="true" class="d-flex justify-between">
      <el-form-item label="用戶名:" class="mb-0">
        <el-input v-model="userInput" placeholder="請輸入用戶名" />
      </el-form-item>
      <el-form-item class="mb-0">
        <el-button
          type="primary"
          :disabled="!userInput.trim()"
          @click="searchUserName"
        >
          搜索
        </el-button>
        <el-button type="secondary" class="btn" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card class="table">
    <el-button type="primary" icon="Plus" @click="showAddOrEditUserDrawer">
      添加用戶
    </el-button>
    <el-button
      type="danger"
      class="btn"
      :disabled="!currentSelectionId.length"
      @click="deleteBatchUsers"
    >
      批量刪除
    </el-button>
    <el-table
      :data="usersData"
      class="table"
      border
      @selection-change="selectChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column type="index" label="#" align="center" />
      <el-table-column prop="id" label="id" width="120px" align="center" />
      <el-table-column
        prop="username"
        label="用戶名稱"
        width="150px"
        align="center"
      />
      <el-table-column prop="roleName" label="用戶角色" align="center" />
      <el-table-column prop="createTime" label="創建時間" align="center" />
      <el-table-column prop="updateTime" label="更新時間" align="center" />
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="showAssignRoleDrawer(row)"
          >
            分配角色
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="showAddOrEditUserDrawer(row)"
          >
            編輯
          </el-button>
          <el-popconfirm
            :title="`您確定要刪掉 ${row.username} 嗎?`"
            icon="Delete"
            icon-color="#f56c6c"
            width="250px"
            @confirm="deleteUser(row.id)"
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
      :page-sizes="[5, 10, 15, 20]"
      v-model:page-size="pageSize"
      layout="prev, pager, next, jumper,->,sizes,total"
      :background="true"
      :total="total"
      @current-change="getUsersData"
      @size-change="changePaginationSize"
    />
    <!-- 新增 & 編輯 drawer -->
    <el-drawer v-model="addOrEditDrawerIsVisible" @close="clearValidate">
      <template #header>
        <h4>{{ currentUser?.id ? '編輯用戶' : '添加用戶' }}</h4>
      </template>
      <template #default>
        <el-form ref="AddOrEditForm" :model="currentUser" :rules="rules">
          <el-form-item prop="username" label="用戶姓名">
            <el-input
              v-model="currentUser.username"
              placeholder="請填寫用戶姓名"
            />
          </el-form-item>
          <el-form-item prop="name" label="用戶暱稱">
            <el-input v-model="currentUser.name" placeholder="請填寫用戶暱稱" />
          </el-form-item>
          <el-form-item v-if="!currentUser.id" prop="password" label="用戶密碼">
            <el-input
              v-model="currentUser.password"
              type="password"
              show-password
              placeholder="請填寫用戶密碼"
            />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div>
          <el-button type="secondary" @click="cancel">取消</el-button>
          <el-button
            :loading="saveLoading"
            :disabled="saveLoading"
            type="primary"
            @click="save"
          >
            確定
          </el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 分配角色 drawer -->
    <el-drawer v-model="assignRoleDrawerIsVisible">
      <template #header>
        <h4>分配用戶角色</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用戶姓名">
            <el-input v-model="currentUser.username" disabled />
          </el-form-item>
          <el-form-item label="角色列表">
            <el-checkbox
              v-model="checkAllRoles"
              :indeterminate="isIndeterminate"
              @change="checkAllRolesChange"
            >
              全選
            </el-checkbox>
            <el-checkbox-group
              v-model="currentUserRoles"
              @change="changeCheckedUserRoles"
            >
              <el-checkbox
                v-for="(role, index) in allRoles"
                :label="`${role.id}-${role.roleName}`"
                :key="index"
              >
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div>
          <el-button type="secondary" @click="userRolesCancel">取消</el-button>
          <el-button
            :loading="saveLoading"
            :disabled="saveLoading"
            type="primary"
            @click="userRolesSave"
          >
            確定
          </el-button>
        </div>
      </template>
    </el-drawer>
  </el-card>
</template>
<script lang="ts" setup>
import useLayoutSettingStore from '@/store/modules/setting'
import { ref, onMounted, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  reqUsersData,
  reqAddUser,
  reqUpdateUser,
  reqGetUserRoles,
  reqAssignUserRoles,
  reqDeleteUser,
  reqDeleteBatchUsers,
} from '@/api/acl/user'
import type {
  UsersDataResponse,
  UserRoleDataResponse,
  UserData,
  UserRoleData,
  ResponseData,
} from '@/api/acl/user/type'

// 獲取 setting store instance
const settingStore = useLayoutSettingStore()

// 分頁器
const pageNo = ref<number>(1)
// 每頁幾筆數據
const pageSize = ref<number>(5)
// user total number
const total = ref<number>(0)
// 存取此頁所有 userData
const usersData = ref<UserData[]>([])
// 改變頁數需要觸發的方法
const changePaginationSize = async () => {
  await getUsersData()
}
// 用戶名存取
const userInput = ref<string>('')
// 重置按鈕功能
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}

const searchUserName = async () => {
  if (!userInput.value.trim()) {
    ElMessage({
      type: 'error',
      message: '搜尋欄不得為空',
    })
  } else {
    await getUsersData(1, userInput.value)
  }
}

// 獲取所有 user API
const getUsersData = async (page: number = 1, username: string = '') => {
  pageNo.value = page
  const reqUsersDataResult: UsersDataResponse = await reqUsersData(
    pageNo.value,
    pageSize.value,
    username,
  )
  if (reqUsersDataResult.code === 200) {
    const { records, total: apiTotal } = reqUsersDataResult.data
    usersData.value = records
    total.value = apiTotal
  }
}

const emptyUsersData = {
  username: '',
  password: '',
  name: '',
}

// 目前選中 user (新增 & 編輯 user使用)
let currentUser = ref<UserData>({
  username: '',
  password: '',
  name: '',
})

const clearCurrentUser = () => {
  currentUser.value = JSON.parse(JSON.stringify(emptyUsersData))
}

// 驗證使用者名稱
const validatorUserName = (rule: any, value: string, callback: any) => {
  if (value?.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('帳號長度至少五位'))
  }
}

// 生產新增 & 編輯使用者表單驗證規則
const rules = computed(() => {
  const currentRules = {
    username: [
      {
        required: true,
        validator: validatorUserName,
        trigger: 'change',
      },
    ],
    name: [
      {
        required: true,
        trigger: 'change',
      },
    ],
    password: [
      {
        required: true,
        min: 6,
        max: 15,
        message: '密碼長度至少六位',
        trigger: 'change',
      },
    ],
  }
  if (currentUser.value.id) {
    const copyRules = JSON.parse(JSON.stringify(currentRules))
    delete copyRules.password
    return copyRules
  } else {
    return currentRules
  }
})

// 控制添加用戶右側 drawer
const addOrEditDrawerIsVisible = ref<boolean>(false)
const showAddOrEditUserDrawer = async (row: UserData | undefined) => {
  if (row?.id) {
    // 若 row 為 true 代表是 Edit
    currentUser.value = row
    AddOrEditForm.value?.resetFields()
  } else {
    clearCurrentUser()
  }
  await nextTick(() => {
    AddOrEditForm.value?.clearValidate()
  })
  addOrEditDrawerIsVisible.value = true
}
const clearValidate = () => {
  AddOrEditForm.value?.clearValidate()
}

// 控制 新增 & 編輯的 btn loading 或 disabled
const saveLoading = ref<boolean>(false)

// 抓 新增 & 編輯 form 表單
const AddOrEditForm = ref()

// 新增 & 編輯 user 確認鍵
const save = async () => {
  // 若是驗證失敗就不會再往下
  await AddOrEditForm.value.validate()
  saveLoading.value = true
  try {
    let result: ResponseData | undefined = undefined
    if (currentUser.value.id) {
      // 有 id 是編輯
      result = await reqUpdateUser(currentUser.value)
    } else {
      result = await reqAddUser(currentUser.value)
    }
    if ((result as ResponseData).code === 200) {
      ElMessage({
        type: 'success',
        message: `${currentUser.value.id ? '編輯' : '新增'}使用者成功`,
      })
      // 獲取最新的使用者資料
      await getUsersData(currentUser.value.id ? pageNo.value : 1)
      // 若是當前登入的帳號再刷新
      // window.location.reload()
      addOrEditDrawerIsVisible.value = false
    } else {
      ElMessage({
        type: 'error',
        message: `${currentUser.value.id ? '編輯' : '新增'}使用者失敗`,
      })
    }
    saveLoading.value = false
  } catch (error) {
    saveLoading.value = false
    ElMessage({
      type: 'error',
      message: (error as Error).message,
    })
  }
}

// 新增 & 編輯 user 取消鍵
const cancel = () => {
  addOrEditDrawerIsVisible.value = false
}

// 所有職位
const allRoles = ref<UserRoleData[]>([])
// 用戶目前的角色，格式為 id-roleName 存取的字串
const currentUserRoles = ref<string[]>([])

// 控制分配角色的 drawer
const assignRoleDrawerIsVisible = ref<boolean>(false)
const showAssignRoleDrawer = async (row: UserData) => {
  currentUser.value = row
  const reqGetUserRolesResponse: UserRoleDataResponse = await reqGetUserRoles(
    currentUser.value.id as number,
  )
  const { assignRoles, allRolesList } = reqGetUserRolesResponse.data
  currentUserRoles.value = assignRoles.map(
    (role) => `${role.id}-${role.roleName}`,
  )
  allRoles.value = allRolesList
  assignRoleDrawerIsVisible.value = true
}

// 角色分配 drawer 中的複選框
// 全選
const checkAllRoles = ref<boolean>(false)
// 設置 checkbox 上的不確定樣式(不是打勾或不打勾是一個橫槓)
const isIndeterminate = ref<boolean>(true)
// 全選框的 change method
const checkAllRolesChange = (val: boolean) => {
  currentUserRoles.value = val
    ? allRoles.value.map((role) => `${role.id}-${role.roleName}`)
    : []
  isIndeterminate.value = !val
}

// 用戶目前選擇角色的方法 (傳入的參數為目前用戶選擇的數量)
const changeCheckedUserRoles = (value: string[]) => {
  checkAllRoles.value = allRoles.value.length === value.length
  isIndeterminate.value = !checkAllRoles.value
}

// 確認用戶所分配角色按紐方法
const userRolesSave = async () => {
  saveLoading.value = true
  const roleIdList = currentUserRoles.value.map((selected: string) =>
    Number(selected.split('-')[0]),
  )
  const userId = currentUser.value.id as number
  const reqAssignUserRolesResult = await reqAssignUserRoles({
    roleIdList,
    userId,
  })
  if (reqAssignUserRolesResult.code === 200) {
    ElMessage({
      type: 'success',
      message: `指派${currentUser.value.username}角色成功`,
    })
    // 關閉此 drawer
    assignRoleDrawerIsVisible.value = false
    // 重新抓取頁面資料,更新完畢留在當前頁
    await getUsersData(pageNo.value)
  } else {
    ElMessage({
      type: 'error',
      message: `指派${currentUser.value.username}角色失敗`,
    })
  }
  saveLoading.value = false
}
// 用戶所分配角色取消按紐方法
const userRolesCancel = () => {
  assignRoleDrawerIsVisible.value = false
}

// 刪除指定用戶
const deleteUser = async (id: number) => {
  const ReqDeleteUserResult = await reqDeleteUser(id)
  if (ReqDeleteUserResult.code === 200) {
    ElMessage({
      type: 'success',
      message: '刪除成功',
    })
    // 重新抓取頁面資料
    await getUsersData(
      usersData.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '刪除失敗',
    })
  }
}

// 存取目前所選擇的 user id
const currentSelectionId = ref<number[]>([])

// table 選取時觸發的方法
const selectChange = (value: UserData[]) => {
  currentSelectionId.value = value.length
    ? value.map((user) => user.id as number)
    : []
}

// 刪除選中的批量用戶按鈕方法
const deleteBatchUsers = async () => {
  const idList: number[] = [...currentSelectionId.value]
  const ReqDeleteBatchUsersResult = await reqDeleteBatchUsers({ idList })
  if (ReqDeleteBatchUsersResult.code === 200) {
    ElMessage({
      type: 'success',
      message: '批量刪除成功',
    })
    // 重新抓取頁面資料
    await getUsersData()
  } else {
    ElMessage({
      type: 'error',
      message: '批量刪除失敗',
    })
  }
}

onMounted(async () => {
  // 獲取所有 user data
  await getUsersData()
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
