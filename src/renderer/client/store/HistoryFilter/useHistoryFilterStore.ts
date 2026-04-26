import { defineStore } from 'pinia'
import type { FilterOption } from './FilterOption.ts'
import { ref } from 'vue'

export const useHistoryFilterStore = defineStore('HistoryFilter', () => {
    const compactList = ref(false)
    const rarityFilter = ref<Array<FilterOption>>([])

    return {
        compactList,
        rarityFilter,
    }
})
