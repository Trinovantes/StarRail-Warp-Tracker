<script lang="ts" setup>
import { computed } from 'vue'
import { WarpBannerType } from '@/common/StarRail'
import { useHistoryFilterStore } from '@/renderer/client/store/HistoryFilter/useHistoryFilterStore'
import { FilterOption } from '@/renderer/client/store/HistoryFilter/FilterOption'
import { useTrackerStore } from '@/renderer/client/store/Tracker/useTrackerStore'
import WarpList from './WarpList.vue'
import BannerPagePityCounter from './BannerPagePityCounter.vue'
import BannerPageStats from './BannerPageStats.vue'
import { useWarpHistory } from './useWarpHistory'

const props = defineProps<{
    bannerType: WarpBannerType
}>()

const bannerType = computed(() => props.bannerType)
const { fetchWarpHistory, clearWarpHistory } = useWarpHistory(bannerType)

const trackerStore = useTrackerStore()
const warpHistory = computed(() => trackerStore.getWarpHistory(props.bannerType))

const historyFilterStore = useHistoryFilterStore()
const filteredBannerWarps = computed(() => {
    const warps = (warpHistory.value?.warps ?? [])
    const inc5Star = historyFilterStore.rarityFilter.includes(FilterOption.Include5Star)
    const inc4Star = historyFilterStore.rarityFilter.includes(FilterOption.Include4Star)

    if (inc4Star && inc5Star) {
        return warps.filter((warp) => warp.rarity === 5 || warp.rarity === 4)
    } else if (inc5Star) {
        return warps.filter((warp) => warp.rarity === 5)
    } else if (inc4Star) {
        return warps.filter((warp) => warp.rarity === 4)
    } else {
        return warps
    }
})
</script>

<template>
    <header>
        <BannerPagePityCounter
            :banner-type="bannerType"
            :star4-pity="warpHistory?.star4Pity"
            :star5-pity="warpHistory?.star5Pity"
            :next-is5050="warpHistory?.nextIs5050"
        />

        <BannerPageStats
            :banner-type="bannerType"
            :banner-warps="warpHistory?.warps ?? []"
        />
    </header>

    <article class="full">
        <section>
            <div class="filters flex-hgap">
                <div class="flex-hgap">
                    <q-btn
                        label="Fetch Warp History from Mihoyo"
                        icon="sync"
                        color="positive"
                        rounded
                        unelevated
                        no-caps
                        @click="fetchWarpHistory"
                    />

                    <q-btn
                        label="Clear Local Data"
                        icon="delete"
                        outline
                        rounded
                        unelevated
                        no-caps
                        @click="clearWarpHistory"
                    />
                </div>

                <q-option-group
                    v-model="historyFilterStore.rarityFilter"
                    type="checkbox"
                    :options="[
                        {
                            label: '',
                            value: FilterOption.Include5Star,
                        },
                        {
                            label: '',
                            value: FilterOption.Include4Star,
                        },
                    ]"
                >
                    <template #label-0>
                        Only 5 <q-icon name="star" />
                    </template>
                    <template #label-1>
                        Only 4 <q-icon name="star" />
                    </template>
                </q-option-group>
            </div>

            <WarpList
                :banner-warps="filteredBannerWarps"
            />
        </section>
    </article>
</template>

<style lang="scss" scoped>
header{
    display: flex;
    flex-wrap: wrap;

    > div{
        flex: 1;
    }

    > div:nth-child(1) {
        background: $dark-1;
    }
    > div:nth-child(2) {
        background: $dark-2;
    }
}

.filters{
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;

    .q-btn{
        font-weight: bold;
    }

    .q-option-group{
        display: flex;
        align-items: center;
        gap: $padding;

        > div{
            margin: 0;
        }

        :deep(.q-checkbox__label){
            display: flex;
            align-items: center;
            gap: 4px;
        }
    }
}
</style>
