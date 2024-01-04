import { defineStore } from 'pinia'
import { FilterOption } from './FilterOption'

// ----------------------------------------------------------------------------
// State
// ----------------------------------------------------------------------------

export type HistoryFilterState = {
    rarityFilter: Array<FilterOption>
}

function createTrackerStore(): HistoryFilterState {
    const defaultState: HistoryFilterState = {
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
