<script lang="ts" setup>
import { NUM_WARPS_PER_PAGE } from '@/common/Constants'
import { usePagination } from './usePagination'
import WarpListItem from './WarpListItem.vue'
import WarpListItemCompact from './WarpListItemCompact.vue'
import { computed, watch } from 'vue'
import { BannerWarp } from '@/main/ipc/tracker/BannerHistory'

const props = defineProps<{
    bannerWarps: Array<BannerWarp>
    compact?: boolean
}>()

const { currentPage, onPaginationChange, maxPages, updateMaxPage } = usePagination(NUM_WARPS_PER_PAGE)
const warpsOnPage = computed<Array<BannerWarp>>(() => {
    const offset = (currentPage.value - 1) * NUM_WARPS_PER_PAGE
    return props.bannerWarps.slice(offset, offset + NUM_WARPS_PER_PAGE)
})

watch(() => props.bannerWarps, (warps) => {
    updateMaxPage(warps.length)
}, {
    immediate: true,
})
</script>

<template>
    <h2
        v-if="warpsOnPage.length === 0"
        class="no-history"
    >
        No Warp History
    </h2>

    <div
        v-else
        :class="{
            history: true,
            compact,
        }"
    >
        <template v-if="compact">
            <WarpListItemCompact
                v-for="warp in warpsOnPage"
                :key="warp.id"
                :banner-warp="warp"
                class="history-item-compact"
            />
        </template>
        <template v-else>
            <WarpListItem
                v-for="warp in warpsOnPage"
                :key="warp.id"
                :banner-warp="warp"
                class="history-item"
            />
        </template>
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

.history:not(.compact){
    border: 1px solid $light-on-dark;

    > .history-item:not(:last-child){
        border-bottom: 1px solid $light-on-dark;
    }
}

.history.compact{
    display: flex;
    gap: $padding;
    flex-wrap: wrap;
}
</style>
