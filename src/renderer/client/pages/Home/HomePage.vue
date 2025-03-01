<script lang="ts" setup>
import { computed } from 'vue'
import { useHistoryFilterStore } from '../../store/HistoryFilter/useHistoryFilterStore'
import { useTrackerStore } from '@/renderer/client/store/Tracker/useTrackerStore'
import BannerPagePityCounter from '../Banner/BannerPagePityCounter.vue'
import WarpList from '../Banner/WarpList.vue'
import { GACHA_BANNER_TYPE_LIMITED_CHARACTER, GACHA_BANNER_TYPE_LIMITED_LIGHT_CONE, GACHA_BANNER_TYPE_STANDARD } from '@/common/StarRail'

const historyFilterStore = useHistoryFilterStore()
const trackerStore = useTrackerStore()
const characterHistory = computed(() => trackerStore.getWarpHistory(GACHA_BANNER_TYPE_LIMITED_CHARACTER))
const lightConeHistory = computed(() => trackerStore.getWarpHistory(GACHA_BANNER_TYPE_LIMITED_LIGHT_CONE))
const stellarHistory = computed(() => trackerStore.getWarpHistory(GACHA_BANNER_TYPE_STANDARD))
const all5StarWarps = computed(() => trackerStore.getAll5StarWarps())
</script>

<template>
    <div class="hero-unit">
        <BannerPagePityCounter
            :banner-type="GACHA_BANNER_TYPE_LIMITED_CHARACTER"
            :star5-pity="characterHistory?.star5Pity"
            :star4-pity="characterHistory?.star4Pity"
            :next-is5050="characterHistory?.nextIs5050"
        >
            <h1>
                Character
            </h1>
        </BannerPagePityCounter>

        <BannerPagePityCounter
            :banner-type="GACHA_BANNER_TYPE_LIMITED_LIGHT_CONE"
            :star5-pity="lightConeHistory?.star5Pity"
            :star4-pity="lightConeHistory?.star4Pity"
            :next-is5050="lightConeHistory?.nextIs5050"
        >
            <h1>
                Light Cone
            </h1>
        </BannerPagePityCounter>

        <BannerPagePityCounter
            :banner-type="GACHA_BANNER_TYPE_STANDARD"
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
        <section>
            <div class="flex-hgap">
                <h1>
                    Recent 5<q-icon name="star" /> Warps
                </h1>

                <div class="flex-1" />

                <q-checkbox
                    v-model="historyFilterStore.compactList"
                    label="Compact"
                />
            </div>

            <WarpList
                :banner-warps="all5StarWarps"
                :compact="historyFilterStore.compactList"
            />
        </section>
    </article>
</template>

<style lang="scss" scoped>
.hero-unit{
    display: flex;
    flex-wrap: wrap;

    > div{
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
