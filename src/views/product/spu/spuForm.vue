<template>
  <el-form label-width="100px">
    <el-form-item label="SPU 名稱">
      <el-input v-model="spuData.spuName" placeholder="請您輸入SPU名稱" />
    </el-form-item>
    <el-form-item label="SPU 品牌">
      <el-select v-model="spuData.tmId">
        <el-option
          v-for="brand in AllTradeMark"
          :key="brand.id"
          :label="brand.tmName"
          :value="brand.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="SPU 描述">
      <el-input
        v-model="spuData.description"
        type="textarea"
        placeholder="請你輸入SPU的描述"
      />
    </el-form-item>
    <el-form-item label="SPU 圖片">
      <!-- el-upload
        v-model:file-list 用來展示已有圖片的 array
        action 上傳圖片暫存的伺服器位置
        list-type 上傳的文件展示的類型 picture 圖片 picture-card 照片牆
        on-preview 點擊預覽的 hook
        on-remove 刪除後的 hook ( 目前不用特別定義其方法就可刪除 )
        before-upload 上傳伺服器前的 hook 常用來約束文件的大小與類型
      -->
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handleUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img class="img-preview" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU 銷售屬性">
      <!-- 展示銷售屬性 -->
      <el-select
        v-model="saleAttrIdAndValueName"
        :placeholder="
          unSelectSaleAttr.length
            ? `還有${unSelectSaleAttr.length}個銷售屬性`
            : '無未選擇的銷售屬性'
        "
      >
        <el-option
          v-for="item in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        />
      </el-select>
      <el-button
        :disabled="!saleAttrIdAndValueName.length"
        type="primary"
        icon="Plus"
        class="btn-plus"
        @click="addSaleAttr"
      >
        添加銷售屬性
      </el-button>
      <!-- table 展示銷售屬性與屬性值 -->
      <el-table class="table-card" border :data="saleAttrData">
        <el-table-column
          label="序號"
          type="index"
          align="center"
          width="80px"
        />
        <el-table-column label="銷售屬性名" prop="saleAttrName" width="120px" />
        <el-table-column label="銷售屬性值">
          <template #="{ row, $index }">
            <el-tag
              class="tag"
              v-for="(tag, index) in row.spuSaleAttrValueList"
              :key="tag.id"
              closable
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ tag.saleAttrValueName }}
            </el-tag>
            <el-input
              v-if="row.inputActive"
              class="tag-input"
              placeholder="請你輸入屬性值"
              size="small"
              v-model="row.saleAttrValue"
              @blur="unFocusedExecuted"
            />
            <el-button
              v-else
              type="success"
              size="small"
              icon="Plus"
              @click="toEditNewTag(row)"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ row, $index }">
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="saleAttrData.splice($index, 1)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        :disabled="!spuData.spuSaleAttrList?.length || !spuData.spuName"
        @click="save"
      >
        保存
      </el-button>
      <el-button type="secondary" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts">
export default {
  name: 'SpuForm',
}
</script>
<script lang="ts" setup>
import { defineEmits, defineExpose, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
} from '@/api/product/spu'
import type {
  SpuData,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SpuImg,
  saleAttr,
  HasSaleAttr,
  AllTradeMarkData,
  TradeMarkData,
} from '@/api/product/spu/type'
const $emit = defineEmits(['changeScene'])
// 點擊取消，通知父組件切換場景
const cancel = () => {
  $emit('changeScene', { sceneNo: 0, action: 'cancel' })
}
// 存取此頁展示的 SPU 全部內容
const spuData = ref<SpuData>({
  spuName: '',
  description: '', // SPU 描述
  category3Id: '', // 第三類的 id
  tmId: '', // 品牌 id
  spuSaleAttrList: [],
  spuImageList: [],
})

// 恢復成起始狀態
const emptySpuData = ref<SpuData>({
  spuName: '',
  description: '', // SPU 描述
  category3Id: '', // 第三類的 id
  tmId: '', // 品牌 id
  spuSaleAttrList: [],
  spuImageList: [],
})

// 存取還未選擇屬性但使用者選後來選取的 id & name
const saleAttrIdAndValueName = ref<string>('')

// 存取此頁 api 獲得的數據
const AllTradeMark = ref<TradeMarkData[]>([])
const imgList = ref<SpuImg[]>([])
// 選定 spu 銷售屬性
const saleAttrData = ref<saleAttr[]>([])
// 所有屬性
const allSaleAttrData = ref<HasSaleAttr[]>([])

// 清空 SPU 新增編輯頁面數據
const clearAllSpuData = () => {
  spuData.value = JSON.parse(JSON.stringify(emptySpuData.value))
  imgList.value = []
  saleAttrData.value = []
  AllTradeMark.value = []
  allSaleAttrData.value = []
  saleAttrIdAndValueName.value = ''
}

// 獲取 api 資料
const initHasSpuData = async (
  row: SpuData | undefined,
  category3Id: string | number | undefined,
) => {
  // 若有傳入 row 資料，是為更新，反之則為新增
  if (row) {
    // row 為父組件傳遞的 spu object 但尚不完整
    spuData.value = JSON.parse(JSON.stringify(row))
    // 獲取該品牌下的所有圖片
    const reqSpuImageResult: SpuHasImg = await reqSpuImageList(row.id as number)
    imgList.value = reqSpuImageResult.data.map((e) => ({
      name: e.imgName,
      url: e.imgUrl,
    }))
    // 獲取已有 SPU 銷售屬性的數據
    const reqSpuHasSaleAttrResult: SaleAttrResponseData =
      await reqSpuHasSaleAttr(row.id as number)
    saleAttrData.value = reqSpuHasSaleAttrResult.data
  } else {
    // 清空原有數據
    clearAllSpuData()
    // 新增記得加入 c3Id
    spuData.value.category3Id = category3Id ? category3Id : ''
  }
  // 獲取全部品牌資訊
  const reqAllTradeMarkResult: AllTradeMarkData = await reqAllTradeMark()
  AllTradeMark.value = reqAllTradeMarkResult.data

  // 獲取整個項目的全部銷售屬性[顏色、版本、尺碼]
  const reqAllSaleAttrResult: HasSaleAttrResponseData = await reqAllSaleAttr()
  allSaleAttrData.value = reqAllSaleAttrResult.data
}

// 從全部銷售屬性對比已有的 SPU 銷售屬性去計算出還有的銷售屬性 並放在 展示銷售屬性欄位下拉選單中
let unSelectSaleAttr = computed(() => {
  return allSaleAttrData.value.filter((item) =>
    saleAttrData.value.every((attr) => attr.saleAttrName !== item.name),
  )
})

// 對外暴露
defineExpose({ initHasSpuData })
// 預覽 dialog 狀態
const dialogVisible = ref<boolean>(false)
// 需放進 dialog 的 url
const dialogImageUrl = ref<string>('')
// el-upload 照片牆點擊預覽的 hook function
const handlePictureCardPreview = (file: any) => {
  // 須將放大圖片的 el-dialog 進行顯示
  dialogVisible.value = true
  // 將需要放大的圖 url 放到 dialog
  dialogImageUrl.value = file.url
}

// el-upload 圖片牆刪除個別圖片
const handleRemove = (file: any) => {
  console.log('刪除' + file.url)
}

// el-upload 圖片牆上傳伺服器前約束文件的大小與類型 ( return true 允許 false 不允許 )
const handleUpload = (file: any) => {
  if (
    file.type === 'image/png' ||
    file.type === 'image/jpeg' ||
    file.type === 'image/gif'
  ) {
    if (file.size / (1024 * 1024) < 3) {
      // 限制上傳文件大小
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '只能上傳<3m的文件',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上傳的文件只能是 PNG | JPG | GIF',
    })
    return false
  }
}

// 點選添加銷售屬性按鈕時的行為
const addSaleAttr = () => {
  // 整理成目前頁面的
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  const newSaleAttr: saleAttr = {
    baseSaleAttrId: Number(baseSaleAttrId),
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  // 追加到已有的銷售屬性表格內
  saleAttrData.value.push(newSaleAttr)
  // 清空原選擇的銷售屬性
  saleAttrIdAndValueName.value = ''
}

// 新增新標籤 ( 最多同時與 row 的數量一樣所以放在 row 中就好 )
const toEditNewTag = (row: saleAttr) => {
  if (row) {
    row.inputActive = true // tag input 顯現
    row.saleAttrValue = '' // tag input 暫存使用者輸入的欄位內容
  }
}

// tag 的表單元素失焦時所執行的方法
const unFocusedExecuted = (row: saleAttr) => {
  if (row) {
    const { baseSaleAttrId, saleAttrValue } = row
    const saleAttrValueName = saleAttrValue ? saleAttrValue.trim() : ''
    // 如果有空值或與現有 tag 內容有重複名稱的都不行
    if (!saleAttrValueName) {
      ElMessage({ type: 'error', message: '屬性值不得為空' })
      return
    } else if (
      !row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName !== saleAttrValueName,
      )
    ) {
      ElMessage({ type: 'error', message: '屬性值不得重複' })
      return
    } else {
      // 成功可以添加
      row.spuSaleAttrValueList.push({ baseSaleAttrId, saleAttrValueName })
      delete row.inputActive // tag input 顯現
      delete row.saleAttrValue // tag input 刪除暫存使用者輸入的欄位內容
    }
  }
}

// 確認儲存
const save = async () => {
  // 有 id 是編輯已有的數據 無 id 會是新增
  // 整理預計上傳的數據
  // 照片牆
  spuData.value.spuImageList = imgList.value.length
    ? imgList.value.map((img: any) => ({
        imgName: img.name,
        // imgUrl 若是有上傳到伺服器的，伺服器會在這 img 物件中存入 response
        // 若有 img.response 且有 img.response.data 的代表後續上傳伺服器的內容 若無則代表是原伺服器上的內容
        imgUrl: (img.response && img.response.data) || img.url,
      }))
    : []
  spuData.value.spuSaleAttrList = saleAttrData.value
  const result = await reqAddOrUpdateSpu(spuData.value)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: spuData.value.id
        ? `${spuData.value.spuName}更新成功`
        : `${spuData.value.spuName}新增成功`,
    })
    // 轉換頁面
    $emit('changeScene', {
      sceneNo: 0,
      action: spuData.value.id ? 'update' : 'add',
    })
    clearAllSpuData()
  } else {
    ElMessage({
      type: 'error',
      message: spuData.value.id
        ? `${spuData.value.spuName}更新失敗`
        : `${spuData.value.spuName}新增失敗`,
    })
  }
}
</script>
<style lang="scss" scoped>
.btn-plus {
  margin-left: 10px;
}

.table-card {
  margin: 10px 0;
}

.img-preview {
  height: 100%;
  width: 100%;
}

.tag {
  margin: 0 5px;
}
.tag-input {
  width: 100px;
  margin-right: 10px;
}
</style>
