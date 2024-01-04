<script lang="ts" setup>
import { NUM_WARPS_PER_PAGE } from '@/common/Constants'
import { WarpHistoryItem } from '@/renderer/client/store/Tracker/parseWarps'
import { usePagination } from './usePagination'
import WarpHistoryListItem from './WarpHistoryListItem.vue'
import { computed, watch } from 'vue'

const props = defineProps<{
    historyItems?: Array<WarpHistoryItem>
}>()

const { currentPage, onPaginationChange, maxPages, updateMaxPage } = usePagination(NUM_WARPS_PER_PAGE)
const historyItemsOnPage = computed<Array<WarpHistoryItem>>(() => {
    const offset = (currentPage.value - 1) * NUM_WARPS_PER_PAGE
    return props.historyItems?.slice(offset, offset + NUM_WARPS_PER_PAGE) ?? []
})

watch(() => props.historyItems, (historyItems) => {
    updateMaxPage(historyItems?.length ?? 0)
}, {
    immediate: true,
})
</script>

<template>
    <h2
        v-if="historyItemsOnPage.length === 0"
        class="no-history"
    >
        No Warp History
    </h2>

    <div
        v-else
        class="history"
    >
        <WarpHistoryListItem
            v-for="item in historyItemsOnPage"
            :key="item.warp.id"
            :history-item="item"
            class="history-item"
        />
    </div>

    <q-pagination
        v-if="maxPages > 1"
        v-model="currentPage"
        :max="maxPages"
        :max-pages="5"
        direction-links
        boundary-links
        @update:model-value="onPaginationChange"
    />
</template>

<style lang="scss" scoped>
.no-history{
    margin: 0;
}

.history{
    border: 1px solid $light-on-dark;

    > .history-item:not(:last-child){
        border-bottom: 1px solid $light-on-dark;
    }
}
</style>
