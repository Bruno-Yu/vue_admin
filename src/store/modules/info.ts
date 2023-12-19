// composition api 的寫法
// 定義小倉庫
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 創建小倉庫
const useTodoStore = defineStore('todo', () => {
  //  state 使用 ref
  const todos = ref([
    { id: 1, title: '吃飯' },
    { id: 2, title: '睡覺' },
    { id: 3, title: '打豆豆' },
  ])
  // getters 使用 computed
  const arr = ref([1, 5, 10])
  const total = computed(() => {
    return arr.value.reduce((prev: number, next: number) => prev + next, 0)
  })
  // 務必要 return 一個 object 內含屬性與方法
  return {
    todos,
    arr,
    total,
    // actions ( 也可以定義完後這邊方變數，結果是一樣的 )
    updateTodos() {
      todos.value.push({ id: 4, title: '治療豆豆' })
    },
  }
})

export default useTodoStore
