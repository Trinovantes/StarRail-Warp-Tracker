import { defineStore } from 'pinia'
import { GachaBannerType } from '@/common/StarRail'
import { WarpTrackerIpcAction } from '@/main/ipc/WarpTracker/WarpTrackerIpcAction'
import { BannerHistory, BannerWarp } from '@/main/ipc/WarpTracker/parseWarps'

// ----------------------------------------------------------------------------
// State
// ----------------------------------------------------------------------------

export type TrackerState = {
    warps: Record<GachaBannerType, BannerHistory | null>
}

function createTrackerStore(): TrackerState {
    const defaultState: TrackerState = {
        warps: {
            [GachaBannerType.EventCharacter]: null,
            [GachaBannerType.EventLightCone]: null,
            [GachaBannerType.Departure]: null,
            [GachaBannerType.StellarWarp]: null,
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

            for (const bannerType of Object.values(GachaBannerType)) {
                const res = await window.api[WarpTrackerIpcAction.GET_WARPS](bannerType)
                if (!res.success) {
                    throw new Error(res.message)
                }

                this.warps[bannerType] = res.data
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

        async clearWarpHistory(bannerType: GachaBannerType): Promise<void> {
            const res = await window.api[WarpTrackerIpcAction.CLEAR_WARPS](bannerType)
            if (!res.success) {
                throw new Error(res.message)
            }

            this.warps[bannerType] = null
        },

        async fetchWarpHistory(bannerType: GachaBannerType): Promise<void> {
            const res = await window.api[WarpTrackerIpcAction.REFRESH_WARPS](bannerType)
            if (!res.success) {
                throw new Error(res.message)
            }

            this.warps[bannerType] = res.data
        },
    },
})
