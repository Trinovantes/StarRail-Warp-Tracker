<script lang="ts" setup>
import { JADES_PER_WARP, GachaBannerType } from '@/common/StarRail'
import { computed } from 'vue'
import { formatPercent } from './formatPercent'
import { BannerWarp } from '@/main/ipc/WarpTracker/parseWarps'

const props = defineProps<{
    bannerType: GachaBannerType
    bannerWarps: Array<BannerWarp>
}>()

const totalWarps = computed(() => props.bannerWarps.length)
const jadesSpent = computed(() => totalWarps.value * JADES_PER_WARP)

const num5Star = computed(() => props.bannerWarps.filter((warp) => warp.rarity === 5).length)
const num4Star = computed(() => props.bannerWarps.filter((warp) => warp.rarity === 4).length)
const percent5StarStr = computed(() => formatPercent(num5Star.value, totalWarps.value))
const percent4StarStr = computed(() => formatPercent(num4Star.value, totalWarps.value))

const rateUpWinRateStr = computed<string>(() => {
    const rateUpItems = props.bannerWarps.filter((warp) => warp.rarity === 5 && !warp.isGuaranteed)
    const limitedItems = rateUpItems.filter((warp) => Boolean(warp.isLimited))
    return formatPercent(limitedItems.length, rateUpItems.length)
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

            <template v-if="props.bannerType === GachaBannerType.EventCharacter">
                <strong>50/50 Win Rate</strong>
                <span>{{ rateUpWinRateStr }}</span>
            </template>
            <template v-if="props.bannerType === GachaBannerType.EventLightCone">
                <strong>75/25 Win Rate</strong>
                <span>{{ rateUpWinRateStr }}</span>
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
