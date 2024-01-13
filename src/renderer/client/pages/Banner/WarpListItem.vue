<script lang="ts" setup>
import { WarpItemType } from '@/common/StarRail'
import { formatDateTime } from './formatDateTime'
import { BannerWarp } from '@/main/ipc/tracker/BannerHistory'

defineProps<{
    bannerWarp: BannerWarp
}>()

const getItemIcon = (itemType: WarpItemType) => {
    switch (itemType) {
        case WarpItemType.Character: return 'person'
        case WarpItemType.LightCone: return 'smartphone'
        default: return ''
    }
}
</script>

<template>
    <div
        class="warp"
        :style="`
            --rarity-color: var(--star-${bannerWarp.rarity});
            --rarity-color-dark: var(--star-${bannerWarp.rarity}-dark);
        `"
    >
        <div class="warp-item-type">
            <q-icon
                :name="getItemIcon(bannerWarp.itemType)"
                :title="bannerWarp.itemType"
            />
        </div>

        <div class="warp-info">
            <h6>
                {{ bannerWarp.itemName }}

                <span
                    v-if="bannerWarp.pity > 0"
                    class="pity"
                    title="Pity"
                >
                    {{ bannerWarp.pity }}
                </span>
            </h6>

            <time
                :datetime="bannerWarp.pulledAt"
                :title="bannerWarp.pulledAt"
            >
                {{ formatDateTime(bannerWarp.pulledAt) }}
            </time>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.warp{
    display: grid;
    grid-template-columns: auto 1fr 100px;
    gap: $padding;
    align-items: center;
    padding: $padding;

    .warp-item-type{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .warp-info{
        display: grid;
        gap: math.div($padding, 4);

        h6{
            display: flex;
            align-items: center;

            color: var(--rarity-color);
            font-weight: normal;
            line-height: 30px;

            span.pity{
                color: white;
                font-weight: bold;
                font-size: 15px;
                line-height: 20px;

                background: var(--rarity-color-dark);
                display: flex;
                align-items: center;
                justify-content: center;

                border-radius: 4px;
                margin-left: math.div($padding, 2);
                height: 26px; width: 26px;
            }
        }
    }
}
</style>