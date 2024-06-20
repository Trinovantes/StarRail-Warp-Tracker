import { isLimitedBanner5Star } from '@/common/StarRail'
import type { Warp } from '@/main/db/models/Warp'

export type BannerWarp = Warp & {
    pity: number
}

export type BannerHistory = {
    star5Pity: number
    star4Pity: number
    nextIs5050: boolean
    warps: Array<BannerWarp>
}

/**
 * Warps from same banner and in desc order of pulled date (i.e. newest first, oldest last)
 */
export function parseWarps(warps: Array<Warp>): BannerHistory {
    let star5Pity = 0
    let star4Pity = 0
    let nextIs5050 = true
    const bannerWarps = new Array<BannerWarp>()

    for (const warp of warps.toReversed()) {
        const bannerWarp = { ...warp, pity: 0 }
        bannerWarps.push(bannerWarp)

        star5Pity++
        star4Pity++

        // Assume 4-star and 5-star have separate pity counters
        if (warp.rarity === 5) {
            bannerWarp.pity = star5Pity
            star5Pity = 0
            nextIs5050 = isLimitedBanner5Star(warp.itemId)
        }
        if (warp.rarity === 4) {
            bannerWarp.pity = star4Pity
            star4Pity = 0
        }
    }

    // Since warps are inserted in reverse order, they must be reversed before being returned
    bannerWarps.reverse()

    return {
        star5Pity,
        star4Pity,
        nextIs5050,
        warps: bannerWarps,
    }
}
