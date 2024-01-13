import { defineStore } from 'pinia'
import { WarpBannerType } from '@/common/StarRail'
import { IpcTrackerAction } from '@/main/ipc/tracker/IpcTrackerAction'
import { BannerHistory, BannerWarp } from '@/main/ipc/tracker/BannerHistory'

// ----------------------------------------------------------------------------
// State
// ----------------------------------------------------------------------------

export type TrackerState = {
    warps: Record<WarpBannerType, BannerHistory | null>
}

function createTrackerStore(): TrackerState {
    const defaultState: TrackerState = {
        warps: {
            [WarpBannerType.EventCharacter]: null,
            [WarpBannerType.EventLightCone]: null,
            [WarpBannerType.Departure]: null,
            [WarpBannerType.StellarWarp]: null,
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

            for (const bannerType of Object.values(WarpBannerType)) {
                const res = await window.api[IpcTrackerAction.GET_WARPS](bannerType)
                if (!res.success) {
                    throw new Error(res.message)
                }

                this.warps[bannerType] = res.data
            }
        },

        getWarpHistory(bannerType: WarpBannerType): BannerHistory | null {
            return this.warps[bannerType]
        },

        getAll5StarWarps(): Array<BannerWarp> {
            const allWarps = new Array<BannerWarp>()

            for (const bannerWarps of Object.values(this.warps)) {
                allWarps.push(...(bannerWarps?.warps.filter((warp) => warp.rarity === 5) ?? []))
            }

            return allWarps.sort((a, b) => b.pulledAt.localeCompare(a.pulledAt))
        },

        async clearWarpHistory(bannerType: WarpBannerType): Promise<void> {
            const res = await window.api[IpcTrackerAction.CLEAR_WARPS](bannerType)
            if (!res.success) {
                throw new Error(res.message)
            }

            this.warps[bannerType] = null
        },

        async fetchWarpHistory(bannerType: WarpBannerType): Promise<void> {
            const res = await window.api[IpcTrackerAction.REFRESH_WARPS](bannerType)
            if (!res.success) {
                throw new Error(res.message)
            }

            this.warps[bannerType] = res.data
        },
    },
})
