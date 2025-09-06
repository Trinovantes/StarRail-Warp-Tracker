import { defineStore } from 'pinia'
import type { FilterOption } from './FilterOption.ts'

// ----------------------------------------------------------------------------
// State
// ----------------------------------------------------------------------------

export type HistoryFilterState = {
    compactList: boolean
    rarityFilter: Array<FilterOption>
}

function createTrackerStore(): HistoryFilterState {
    const defaultState: HistoryFilterState = {
        compactList: false,
        rarityFilter: [],
    }

    return defaultState
}

// ----------------------------------------------------------------------------
// Store
// ----------------------------------------------------------------------------

export const useHistoryFilterStore = defineStore('HistoryFilter', {
    state: createTrackerStore,
})
