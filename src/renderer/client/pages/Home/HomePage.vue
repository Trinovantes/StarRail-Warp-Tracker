<script lang="ts" setup>
import { computed } from 'vue'
import { useTrackerStore } from '@/renderer/client/store/Tracker/useTrackerStore'
import BannerPagePityCounter from '../Banner/BannerPagePityCounter.vue'
import { WarpBannerType } from '@/common/StarRail'
import WarpHistoryList from '../Banner/WarpHistoryList.vue'

const trackerStore = useTrackerStore()
const characterHistory = computed(() => trackerStore.getWarpHistory(WarpBannerType.EventCharacter))
const lightConeHistory = computed(() => trackerStore.getWarpHistory(WarpBannerType.EventLightCone))
const stellarHistory = computed(() => trackerStore.getWarpHistory(WarpBannerType.StellarWarp))
const all5StarWarps = computed(() => trackerStore.getAll5StarWarps())
</script>

<template>
    <div class="hero-unit">
        <BannerPagePityCounter
            :banner-type="WarpBannerType.EventCharacter"
            :star5-pity="characterHistory?.star5Pity"
            :star4-pity="characterHistory?.star4Pity"
            :next-is5050="characterHistory?.nextIs5050"
        >
            <h1>
                Character
            </h1>
        </BannerPagePityCounter>

        <BannerPagePityCounter
            :banner-type="WarpBannerType.EventLightCone"
            :star5-pity="lightConeHistory?.star5Pity"
            :star4-pity="lightConeHistory?.star4Pity"
            :next-is5050="lightConeHistory?.nextIs5050"
        >
            <h1>
                Light Cone
            </h1>
        </BannerPagePityCounter>

        <BannerPagePityCounter
            :banner-type="WarpBannerType.StellarWarp"
            :star5-pity="stellarHistory?.star5Pity"
            :star4-pity="stellarHistory?.star4Pity"
            :next-is5050="stellarHistory?.nextIs5050"
        >
            <h1>
                Stellar Warp
            </h1>
        </BannerPagePityCounter>
    </div>

    <article class="full">
        <h1>
            Recent 5<q-icon name="star" /> Warps
        </h1>

        <WarpHistoryList
            :history-items="all5StarWarps"
        />
    </article>
</template>

<style lang="scss" scoped>
.hero-unit{
    display: flex;
    flex-wrap: wrap;

    > :deep(div){
        flex: 1;
        align-content: start;
        padding: $padding * 2;

        &:nth-child(1){
            background: $dark-1;
        }
        &:nth-child(2){
            background: $dark-2;
        }
        &:nth-child(3){
            background: $dark-3;
        }
    }

    h1{
        text-align: center;
    }
}

article{
    h1{
        display: flex;
        align-items: center;
        gap: 4px;
    }
}
</style>
