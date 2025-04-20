import { defineStore } from 'pinia'
import { ALL_GACHA_BANNERS, GACHA_BANNER_TYPE_BEGINNER, GACHA_BANNER_TYPE_LIMITED_CHARACTER, GACHA_BANNER_TYPE_LIMITED_LIGHT_CONE, GACHA_BANNER_TYPE_STANDARD, GachaBannerType } from '@/common/StarRail'
import { BannerHistory, BannerWarp } from '@/main/ipc/WarpTracker/parseWarps'
import { WARP_TRACKER_IPC_ACTION } from '@/main/ipc/WarpTracker/WarpTrackerIpcAction'

// ----------------------------------------------------------------------------
// State
// ----------------------------------------------------------------------------

export type TrackerState = {
    warps: Record<GachaBannerType, BannerHistory | null>
}

function createTrackerStore(): TrackerState {
    const defaultState: TrackerState = {
        warps: {
            [GACHA_BANNER_TYPE_STANDARD]: null,
            [GACHA_BANNER_TYPE_BEGINNER]: null,
            [GACHA_BANNER_TYPE_LIMITED_CHARACTER]: null,
            [GACHA_BANNER_TYPE_LIMITED_LIGHT_CONE]: null,
        },
    }

    return defaultState
}

// ----------------------------------------------------------------------------
// Store
// ----------------------------------------------------------------------------

export const useTrackerStore = defineStore('Tracker', {
    state: createTrackerStore,

    actions: {
        async init(): Promise<void> {
            console.info('Tracker::init()')

            for (const gachaBanner of ALL_GACHA_BANNERS) {
                const res = await window.api[WARP_TRACKER_IPC_ACTION.GET_WARPS](gachaBanner.type)
                if (!res.success) {
                    throw new Error(res.errMsg)
                }

                this.warps[gachaBanner.type] = res.data
            }
        },

        getWarpHistory(bannerType: GachaBannerType): BannerHistory | null {
            return this.warps[bannerType]
        },

        getAll5StarWarps(): Array<BannerWarp> {
            const allWarps = new Array<BannerWarp>()

            for (const bannerWarps of Object.values(this.warps)) {
                allWarps.push(...(bannerWarps?.warps.filter((warp) => warp.rarity === 5) ?? []))
            }

            return allWarps.sort((a, b) => b.pulledAt.localeCompare(a.pulledAt))
        },

        async clearWarpHistory(bannerType: GachaBannerType) {
            const res = await window.api[WARP_TRACKER_IPC_ACTION.CLEAR_WARPS](bannerType)
            if (res.success) {
                this.warps[bannerType] = null
            }

            return res
        },

        async refreshWarpHistory(bannerType: GachaBannerType) {
            const res = await window.api[WARP_TRACKER_IPC_ACTION.REFRESH_WARPS](bannerType)
            if (res.success) {
                this.warps[bannerType] = res.data
            }

            return res
        },
    },
})
