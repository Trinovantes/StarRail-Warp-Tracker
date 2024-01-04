<script lang="ts" setup>
import { JADES_PER_WARP, WarpBannerType, isLimitedBanner5Star } from '@/common/StarRail'
import { computed } from 'vue'
import { WarpHistoryItem } from '@/renderer/client/store/Tracker/parseWarps'
import { formatPercent } from './formatPercent'

const props = withDefaults(defineProps<{
    bannerType: WarpBannerType
    historyItems?: Array<WarpHistoryItem>
}>(), {
    historyItems: () => [],
})

const totalWarps = computed(() => props.historyItems.length)
const jadesSpent = computed(() => totalWarps.value * JADES_PER_WARP)

const num5Star = computed(() => props.historyItems.filter((item) => item.warp.rarity === 5).length)
const num4Star = computed(() => props.historyItems.filter((item) => item.warp.rarity === 4).length)
const percent5StarStr = computed(() => formatPercent(num5Star.value, totalWarps.value))
const percent4StarStr = computed(() => formatPercent(num4Star.value, totalWarps.value))

const midpointWinRateStr = computed<string>(() => {
    const star5Items = props.historyItems.filter((item) => item.warp.rarity === 5)
    const limitedCharacters = star5Items.filter((item) => isLimitedBanner5Star(item.warp.itemId))
    return formatPercent(limitedCharacters.length, star5Items.length)
})
</script>

<template>
    <div class="container">
        <div class="stats">
            <strong>Total Warps</strong>
            <span>{{ totalWarps.toLocaleString() }}</span>

            <strong>Jades Spent</strong>
            <span>{{ jadesSpent.toLocaleString() }}</span>

            <strong>Number of 5<q-icon name="star" /></strong>
            <span>{{ num5Star.toLocaleString() }} ({{ percent5StarStr }})</span>

            <strong>Number of 4<q-icon name="star" /></strong>
            <span>{{ num4Star.toLocaleString() }} ({{ percent4StarStr }})</span>

            <template v-if="props.bannerType === WarpBannerType.EventCharacter">
                <strong>50/50 Win Rate</strong>
                <span>{{ midpointWinRateStr }}</span>
            </template>
            <template v-if="props.bannerType === WarpBannerType.EventLightCone">
                <strong>75/25 Win Rate</strong>
                <span>{{ midpointWinRateStr }}</span>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container{
    display: grid;
    align-content: center;
    justify-content: center;
}

.stats{
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: math.div($padding, 2);
    align-items: center;
    justify-content: space-between;
    padding: $padding * 2;
    width: 400px;

    > span,
    > strong{
        display: flex;
        align-items: center;
        font-size: 21px;
        line-height: 30px;
    }

    > span{
        justify-content: right;
    }
}
</style>
