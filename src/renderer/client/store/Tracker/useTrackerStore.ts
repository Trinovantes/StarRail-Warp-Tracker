import { defineStore } from 'pinia'
import type { BannerHistory } from '../../../../main/ipc/WarpTracker/parseWarps.ts'
import { WARP_TRACKER_IPC_ACTION } from '../../../../main/ipc/WarpTracker/WarpTrackerIpcAction.ts'
import { type GachaBannerType, GACHA_BANNER_TYPE_STANDARD, GACHA_BANNER_TYPE_BEGINNER, GACHA_BANNER_TYPE_LIMITED_CHARACTER, GACHA_BANNER_TYPE_LIMITED_LIGHT_CONE, GACHA_BANNER_TYPE_COLLAB_CHARACTER, GACHA_BANNER_TYPE_COLLAB_LIGHT_CONE, ALL_GACHA_BANNERS } from '../../../../common/StarRail.ts'
import { ref } from 'vue'

export const useTrackerStore = defineStore('Tracker', () => {
    const bannerHistories = ref<Record<GachaBannerType, BannerHistory | null>>({
        [GACHA_BANNER_TYPE_STANDARD]: null,
        [GACHA_BANNER_TYPE_BEGINNER]: null,
        [GACHA_BANNER_TYPE_LIMITED_CHARACTER]: null,
        [GACHA_BANNER_TYPE_LIMITED_LIGHT_CONE]: null,
        [GACHA_BANNER_TYPE_COLLAB_CHARACTER]: null,
        [GACHA_BANNER_TYPE_COLLAB_LIGHT_CONE]: null,
    })

    const fetchWarpHistory = async (bannerType: GachaBannerType) => {
        const res = await window.api[WARP_TRACKER_IPC_ACTION.REFRESH_WARPS](bannerType)
        if (res.success) {
            bannerHistories.value[bannerType] = res.data
        }

        return res
    }

    const clearWarpHistory = async (bannerType: GachaBannerType) => {
        const res = await window.api[WARP_TRACKER_IPC_ACTION.CLEAR_WARPS](bannerType)
        if (res.success) {
            bannerHistories.value[bannerType] = null
        }

        return res
    }

    const init = async () => {
        for (const gachaBanner of ALL_GACHA_BANNERS) {
            const bannerType = gachaBanner.type
            const res = await window.api[WARP_TRACKER_IPC_ACTION.GET_WARPS](bannerType)
            if (res.success) {
                bannerHistories.value[bannerType] = res.data
            }
        }
    }

    return {
        bannerHistories,

        init,
        fetchWarpHistory,
        clearWarpHistory,
    }
})
