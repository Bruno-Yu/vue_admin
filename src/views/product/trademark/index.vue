<template>
  <el-card class="box-card">
    <!-- 添加品牌按鈕 -->
    <el-button type="primary" icon="Plus" @click="addTrademark">
      添加品牌
    </el-button>
    <!-- table 組件: 用於展示已有的數據 -->
    <!-- el-table 的 attr 
          border 代表縱向表格是否需要邊框
        el-table-column
        --label 設置某欄標題
        --width 設置欄寬度
        -- align 設定此欄對其方式
    -->
    <!--  -->
    <el-table class="table" border :data="trademarkData">
      <el-table-column
        label="序號"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <!-- el-table-column 默認展示數據為 div 但若需要用其他結構可以用 slot -->
      <el-table-column prop="tmName" label="品牌名稱"></el-table-column>
      <el-table-column label="品牌 LOGO" align="center">
        <template #="{ row, $index }">
          <img :src="row.logoUrl" :alt="row.tmName" class="logoImage" />
        </template>
      </el-table-column>
      <el-table-column label="操作工具">
        <template #="{ row, $index }">
          <el-button
            type="warning"
            size="small"
            icon="Edit"
            @click="updateTrademark(row)"
          />
          <el-popconfirm
            :title="`您確定要刪掉 ${row.tmName}品牌嗎?`"
            icon="Delete"
            icon-color="#f56c6c"
            width="250px"
            @confirm="deleteTrademark(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete" />
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分頁器 -->
    <!-- pagination
            v-model:current-page: 設置當前的頁碼 ( 雙向 )
            v-model:page-size: 設置每頁展示數據的項目數 ( 雙向 )
            page-sizes: array 設置每頁要呈現多少項目的設定
            background: boolean 設置每頁按鈕的背景顏色
            layout: 設置分頁器的 6 個子組件( total, sizes, prev, pager, next, jumper )哪些要呈現 &  呈現順序 (功能符號 -> 可以移動到最右邊)
            page-count: 中間連續的頁碼數(加上第一與最後各一)
            prev-icon 或 pre-page: 設置上一頁功能的 icon 或文字
    -->
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="limitItems"
        :page-sizes="[3, 6, 9, 12]"
        :background="true"
        layout=" prev, pager, next, jumper, -> ,sizes, total"
        :total="total"
        @current-change="getHasTrademark(pageNo)"
        @size-change="changePageSize"
      />
    </div>
  </el-card>
  <!-- 新增或修改彈跳視窗 -->
  <!-- v-model: boolean 控制 dialog 的出現與否 
      title: 設置 dialog 標題
  -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
  >
    <el-form
      class="add-form"
      :model="trademarkParams"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item label="品牌名稱" label-width="90px" prop="tmName">
        <el-input
          v-model="trademarkParams.tmName"
          placeholder="請您輸入品牌名稱"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌 LOGO" label-width="90px" prop="logoUrl">
        <!-- el-upload 屬性
              action 後接上傳的 server api 地址，但要記得加上原 proxy 的前綴 /api/
              before-upload 上傳文件前會觸發的 hook 方法，常用來約束文件類型/大小
        -->
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :before-upload="beforeImgUpload"
          :on-success="handleImgSuccess"
        >
          <img
            v-if="trademarkParams.logoUrl"
            :src="trademarkParams.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 具名插槽 Footer -->
    <template #footer>
      <el-button type="primary" @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">確定</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark
} from '@/api/product/trademark'
import type {
  Records,
  TradeMarkResponseData,
  TradeMarkData,
} from '@/api/product/trademark/type'
// 當前頁面
const pageNo = ref<number>(1)
// 定義每頁展示多少調數據
const limitItems = ref<number>(3)

// 存取目前 api 資料總數
const total = ref<number>(0)

// 目前  api 品牌數據
const trademarkData = ref<Records>([])

// 控制 dialog 顯示與否
const dialogFormVisible = ref<boolean>(false)

// 獲取品牌數據 & 進行封裝 ( 方便調用 )
const getHasTrademark = async (page = 1) => {
  pageNo.value = page
  const result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    limitItems.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    trademarkData.value = result.data.records
  }
}

// // 當分頁器的目前頁碼改變時會觸發
// const changePageNo = () => {
//   getHasTrademark()
// }

// 當分頁器的目前項目數/頁改變時會觸發
const changePageSize = () => {
  // 有鑑於每頁項目呈現的數目改變時，其頁面 & 對應的資料都會改變，因此每次變換都重置成 1，這段回到 getHasTrademark 去呈現
  // pageNo.value = 1
  getHasTrademark()
}

// 蒐集 dialog 上新增品牌的數據
const trademarkParams = reactive<TradeMarkData>({
  tmName: '',
  logoUrl: '',
})

// el-upload 組件上傳前會觸發的鉤子函式 (event before-upload)
// 通常用來約束上傳文件類型 & 大小
const beforeImgUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 要求目前上傳的格式條件 png | jpg | gif 以及大小須小於 4 M
  if (
    rawFile.type === 'image/png' ||
    rawFile.type === 'image/jpeg' ||
    rawFile.type === 'image/gif'
  ) {
    // rawFile.size 單位是 bytes
    // 1KB = 1024 Bytes ; 1MB = 1024KB
    // 需小於 4 MB
    if (rawFile.size / 1024 / 1024 < 4) {
      return true // 會繼續函式之後行為
    } else {
      ElMessage({
        type: 'error',
        message: '圖片大小必須小於 4 MB',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '格式必須為 png 或 jpg 或 gif',
    })
    return false // 會中斷函式之後行為
  }
}

// el-upload 組件上傳成功後會觸發的鉤子函式 (event onSuccess)
const handleImgSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  // response 這物上傳 server 返回的數據
  trademarkParams.logoUrl = response.data // server 回傳的圖片位置
  // 圖片上傳成功後，清除掉圖片校驗的信息
  formRef.value.clearValidate('logoUrl')
}

// 添加品牌清按鈕
const addTrademark = () => {
  // 把原上傳內容清空
  trademarkParams.id = undefined
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  dialogFormVisible.value = true
  // 必須注意，第一次點擊由於 dialog 本身還沒生成，所以使用 ref 取不到 instance
  // 但第二次 ~ N次就有了
  // 刪掉上次驗證的訊息
  // 解法一: 利用可選屬性語法
  // formRef.value?.clearValidate() // 不帶入參數就是全部拿掉
  // 解法二: 利用 nextTick 確保 DOM 掛載 & 渲染後在執行
  nextTick(() => {
    formRef.value.clearValidate()
  })
}

// 編輯品牌按鈕
const updateTrademark = (row) => {
  formRef.value?.clearValidate() // 清空上一次校驗規則錯誤的錯誤信息
  // trademarkParams.id = row.id
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl
  // 以上三行可以合併成 ES6 Assign 的語法
  Object.assign(trademarkParams, row)
  dialogFormVisible.value = true
}

// 刪除品牌按鈕
const deleteTrademark = (id:number) => {
  // dialogFormVisible.value = true
  reqDeleteTrademark(id)
}

// dialog 取消按鈕
const cancel = () => {
  dialogFormVisible.value = false
}

// 獲取 form DOM 元素
const formRef = ref()

// dialog 確定按鈕
const confirm = async () => {
  // 打 api 前須針對整個表單進行校正
  // const validateResult = formRef.value.validate() // 同時也會觸發剛才 el-update 不管在 blur 或 change 都不適合的校正
  await formRef.value.validate() // 會回傳 promise 若是 rejected 則不會繼續往下(並會顯示 error 信息)，但若是 fulfilled 則會繼續
  // console.log(' validateResult', validateResult)
  const result: any = await reqAddOrUpdateTrademark(trademarkParams)
  if (result.code === 200) {
    // 添加/修改品牌成功
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '編輯品牌成功' : '添加品牌成功',
    })
    // 需要刷新頁面上所有項目，所以必須再次發請求
    getHasTrademark(pageNo.value)
  } else {
    // 添加/修改品牌失敗
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '編輯品牌失敗' : '添加品牌失敗',
    })
    dialogFormVisible.value = false
  }
}

// 品牌名稱自訂義校驗方法
const validatorTmName = (rule: any, value: any, callback: any) => {
  // 自訂義規則
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('品牌名稱必須兩個字以上'))
  }
}

// 品牌 logo 圖片自訂義校驗方法
const validatorLogoUrl = (rule: any, value: any, callback: any) => {
  // 自訂義規則
  if (value) {
    callback()
  } else {
    callback(new Error('必須上傳圖片'))
  }
}

// 表單校驗規則對象
const rules = {
  tmName: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorTmName,
    },
  ],
  logoUrl: [
    {
      required: true,
      validator: validatorLogoUrl,
    },
  ],
}

// 組件掛載後
onMounted(() => {
  getHasTrademark()
})
</script>
<style lang="scss" scoped>
.table {
  margin: 10px 0;
}
.logoImage {
  width: 100px;
  height: 100px;
}

.add-form {
  width: 80%;
}

// upload element
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
