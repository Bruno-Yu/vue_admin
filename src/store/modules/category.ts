// 商品分類全局組件的 repo
import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr/index.ts'
import type { CategoryResponseData } from '@/api/product/attr/type'
import type { CategoryState } from './types/type'

const useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      c1Arr: [],
      c1Id: '',
      c2Arr: [],
      c2Id: '',
      c3Arr: [],
      c3Id: '',
    }
  },
  actions: {
    async getC1() {
      this.c1Id = ''
      this.c2Arr = []
      this.c2Id = ''
      this.c3Arr = []
      this.c3Id = ''
      const result: CategoryResponseData = await reqC1()
      if (result.code === 200) {
        this.c1Arr = result.data
      }
    },
    async getC2() {
      if (this.c1Id) {
        this.c2Id = ''
        this.c3Arr = []
        this.c3Id = ''
        const result: CategoryResponseData = await reqC2(this.c1Id)
        if (result.code === 200) {
          this.c2Arr = result.data
        }
      }
    },
    async getC3() {
      if (this.c2Id) {
        this.c3Id = ''
        const result: CategoryResponseData = await reqC3(this.c2Id)
        if (result.code === 200) {
          this.c3Arr = result.data
        }
      }
    },
  },
})

export default useCategoryStore
