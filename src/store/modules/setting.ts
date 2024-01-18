// layout 樣式變化狀態的倉庫
import { defineStore } from 'pinia'

const useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, // 用戶控制左側菜單是否摺疊的狀態
      refresh: false, // 用戶控制工具列刷新按鈕的狀態
    }
  },
})

export default useLayoutSettingStore
