import type { Warp } from '../../../common/db/models/Warp.ts'
import { isLimitedBanner5Star } from '../../../common/StarRail.ts'

export type BannerWarp = Warp & {
    pity: number
    isLimited?: boolean
    isGuaranteed?: boolean
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
    let next5StarIs5050 = true
    let next5StarIsGuaranteed = false

    const bannerWarps = new Array<BannerWarp>()
    const sortedWarps = warps.toSorted((a, b) => a.pulledAt.localeCompare(b.pulledAt))

    for (const warp of sortedWarps) {
        const bannerWarp: BannerWarp = { ...warp, pity: 0 }
        bannerWarps.push(bannerWarp)

        star5Pity++
        star4Pity++

        // Assume 4-star and 5-star have separate pity counters
        if (warp.rarity === 5) {
            const isLimited = isLimitedBanner5Star(warp.itemId, warp.bannerId)

            bannerWarp.pity = star5Pity
            bannerWarp.isLimited = isLimited
            bannerWarp.isGuaranteed = next5StarIsGuaranteed

            star5Pity = 0
            next5StarIs5050 = isLimited
            next5StarIsGuaranteed = !next5StarIs5050
        }
        if (warp.rarity === 4) {
            bannerWarp.pity = star4Pity
            star4Pity = 0
        }
    }

    return {
        star5Pity,
        star4Pity,
        nextIs5050: next5StarIs5050,
        warps: bannerWarps.toReversed(), // Return warps in desc order
    }
}
