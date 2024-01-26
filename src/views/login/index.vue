<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>歡迎來到萬點練習</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              show-password
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <!-- 使用 :disabled="loading" 可以防止用戶多次點擊 -->
            <el-button
              :loading="loading"
              :disabled="loading"
              type="primary"
              size="default"
              class="login_btn"
              @click="login"
            >
              登入
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
// element ui 的 toast 也就是 提示小彈窗 跟 message 功能類似，樣式不同
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'

const userStore = useUserStore()
const $router = useRouter()
const $route = useRoute()
// 控制按鈕 loading 加載效果
const loading = ref(false)
// 獲取表單 DOM
const loginForms = ref()
// 蒐集帳號與密碼的數據
const loginForm = reactive({ username: 'admin', password: 'atguigu123' })
// 自定義校驗函數
const validatorUserName = (rule: any, value: any, callback: any) => {
  // rule 即為校驗規則對象
  // value 即為表單元素的文本內容
  // callback: 函式，若符合條件使用 callback 放行 ; 若不通過則同樣使用 callback 但注入錯誤信息
  // /^\d{5,10}/.test(value)
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('帳號長度至少五位'))
  }
}
const login = async () => {
  //  form validate 接收一個回調函數，或是回傳一個 promise ( 若通過 fulfilled 若沒通過 rejected )
  // 若沒通過校正則會回傳 rejected 的 promised error 就不會再往下走了
  await loginForms.value.validate()
  // 按鈕加載效果開始
  loading.value = true
  // 請求成功轉往首頁展示數據
  // 請求失敗則跳出失敗信息
  // 可以直接執行 userStore.userLogin(loginForm)
  // 或是直接用變數來承接 async 的 promiseState ex: fulfilled
  // 但要注意，若 userStore.userLogin 有沒有定義成功 & 失敗的處理方式，單從這邊是看不出來的
  // 此時可以用 userStore.userLogin(loginForm).then 的 promise 寫法
  // 但這邊展示的是使用 try catch 寫法
  try {
    // 保證登入成功
    await userStore.userLogin(loginForm)
    // 做判斷 若當前路由有 query 則依照 query 的路徑推，若無則以首頁路徑'/' 推
    const redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    ElNotification({
      type: 'success',
      message: '登入成功',
      title: `HI, ${loginForm.username}${getTime()}好`,
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }

  // 筆者推測: 不直接放在這邊否則 try 內部的 await 與 catch 沒跑完就 false 了
  // loading.value = false

  // finally {
  // 筆者推測:不放在 finally 內部也一樣會先 false 後再轉頁
  //   loading.value = false
  // }
}

// 定義表單校正需要用到的配置對象
// rules 在這邊是定義死的，所以不用用響應的 reactive 或是 ref
const rules = {
  username: [
    {
      required: true, // 必要校驗
      validator: validatorUserName,
      max: 10, // 文本最大長度
      trigger: 'change', // 觸發表單驗證的時機 change 改變輸入內容 blur 失去焦點
    },
  ],
  password: [
    {
      required: true, // 必要校驗
      min: 6, //  文本最小長度
      max: 15, // 文本最大長度
      message: '密碼長度至少六位', // 錯誤提示信息
      trigger: 'change', // 觸發表單驗證的時機 change 改變輸入內容 blur 失去焦點
    },
  ],
}
</script>

<style lang="scss">
.login_container {
  width: 100vw;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
}
.login_form {
  position: relative;
  width: 80%;
  top: 30vh;
  padding: 20px;
  background: url('@/assets/images/login_form.png') no-repeat;
  background-size: cover;
  h1 {
    font-size: 40px;
    color: white;
  }
  h2 {
    font-size: 20px;
    color: white;
    margin: 20px 0;
  }
  .login_btn {
    width: 100%;
  }
}
</style>
