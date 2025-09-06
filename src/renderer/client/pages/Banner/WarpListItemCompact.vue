<script lang="ts" setup>
import { computed } from 'vue'
import { getPityCssColor } from './getPityCssColor.ts'
import { getItemIcon } from './getItemIcon.ts'
import { loadFallbackItemIcon } from './loadFallbackItemIcon.ts'
import type { BannerWarp } from '../../../../main/ipc/WarpTracker/parseWarps.ts'

const props = defineProps<{
    bannerWarp: BannerWarp
}>()

const itemName = computed(() => props.bannerWarp.itemName)
const iconSrc = computed(() => getItemIcon(props.bannerWarp))
const pityColor = computed(() => getPityCssColor(props.bannerWarp))
</script>

<template>
    <div
        class="warp"
        :style="`
            --pity-color: ${pityColor};
        `"
    >
        <img
            :src="iconSrc"
            :title="itemName"
            @error.once="loadFallbackItemIcon"
        >

        <span
            v-if="bannerWarp.pity > 0"
            class="pity"
            title="Pity"
        >
            {{ bannerWarp.pity }}
        </span>
    </div>
</template>

<style lang="scss" scoped>
.warp{
    position: relative;
    width: 64px;
    height: 64px;

    img{
        display: block;
        object-fit: contain;
        width: 64px;
        height: 64px;
    }

    span.pity{
        color: white;
        font-weight: bold;
        font-size: 15px;
        line-height: 20px;

        background: var(--pity-color);
        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 4px;
        margin-left: math.div($padding, 2);
        height: 26px; width: 26px;

        position: absolute;
        top: 0;
        right: 0;
    }
}
</style>
