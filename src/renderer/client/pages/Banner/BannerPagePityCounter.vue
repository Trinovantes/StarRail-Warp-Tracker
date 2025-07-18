<script lang="ts" setup>
import { GACHA_BANNER_TYPE_COLLAB_CHARACTER, GACHA_BANNER_TYPE_COLLAB_LIGHT_CONE, GACHA_BANNER_TYPE_LIMITED_CHARACTER, GACHA_BANNER_TYPE_LIMITED_LIGHT_CONE, GachaBannerType, getMaxBannerPity } from '@/common/StarRail'

const props = withDefaults(defineProps<{
    bannerType: GachaBannerType
    star5Pity?: number
    star4Pity?: number
    nextIs5050?: boolean
}>(), {
    star5Pity: 0,
    star4Pity: 0,
    nextIs5050: true,
})
</script>

<template>
    <div class="container">
        <div class="pity-counter">
            <div
                v-if="$slots.default"
                class="slot"
            >
                <slot />
            </div>

            <span>5<q-icon name="star" /> Pity</span>
            <strong>{{ star5Pity }} / {{ getMaxBannerPity(props.bannerType) }}</strong>
            <span>4<q-icon name="star" /> Pity</span>
            <strong>{{ star4Pity }} / 10</strong>

            <div
                v-if="bannerType === GACHA_BANNER_TYPE_LIMITED_CHARACTER || bannerType === GACHA_BANNER_TYPE_LIMITED_LIGHT_CONE || bannerType === GACHA_BANNER_TYPE_COLLAB_CHARACTER || bannerType === GACHA_BANNER_TYPE_COLLAB_LIGHT_CONE"
                class="next5star"
            >
                <strong v-if="nextIs5050" class="not-guaranteed">
                    Next 5 Star is
                    <template v-if="bannerType === GACHA_BANNER_TYPE_LIMITED_CHARACTER || bannerType === GACHA_BANNER_TYPE_COLLAB_CHARACTER">
                        50/50
                    </template>
                    <template v-else-if="bannerType === GACHA_BANNER_TYPE_LIMITED_LIGHT_CONE || bannerType === GACHA_BANNER_TYPE_COLLAB_LIGHT_CONE">
                        75/25
                    </template>
                </strong>
                <strong v-else class="guaranteed">
                    Next 5 Star is Guaranteed
                </strong>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container{
    display: grid;
    align-content: center;
    justify-content: center;
}

.pity-counter{
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: $padding * 2;
    align-items: center;
    justify-content: space-between;
    padding: ($padding * 4) ($padding * 2);
    width: $stats-width;

    > span,
    > strong{
        display: flex;
        align-items: center;
        font-size: 48px;
        line-height: 60px;
    }

    > span{
        gap: 8px;
    }

    > strong{
        justify-content: right;
    }

    .slot{
        grid-column-start: 1;
        grid-column-end: -1;
        margin-bottom: $padding;
    }

    .next5star{
        grid-column-start: 1;
        grid-column-end: -1;
        display: flex;
        justify-content: center;
        margin-top: $padding * 2;

        strong{
            border: 1px solid $light-on-dark;
            border-radius: 2px;
            display: inline-block;
            padding: math.div($padding, 2) $padding;
            text-align: center;
            text-transform: uppercase;

            &.not-guaranteed{
                background: $warning;
            }
            &.guaranteed{
                background: $positive;
            }
        }
    }
}
</style>
