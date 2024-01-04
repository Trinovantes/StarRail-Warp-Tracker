import { isLimitedBanner5Star } from '@/common/StarRail'
import type { Warp } from '@/main/db/models/Warp'

export type WarpHistoryItem = {
    pity: number
    warp: Warp
}

export type WarpHistory = {
    star5Pity: number
    star4Pity: number
    nextIs5050: boolean
    history: Array<WarpHistoryItem>
}

export function parseWarps(warps: Array<Warp>): WarpHistory {
    let star5Pity = 0
    let star4Pity = 0
    let nextIs5050 = true
    const history: WarpHistory['history'] = []

    for (const warp of warps.toReversed()) {
        const historyItem = { pity: 0, warp }
        history.push(historyItem)

        star5Pity++
        star4Pity++

        // Assume 4-star and 5-star have separate pity counters
        if (warp.rarity === 5) {
            historyItem.pity = star5Pity
            star5Pity = 0
            nextIs5050 = isLimitedBanner5Star(warp.itemId)
        }
        if (warp.rarity === 4) {
            historyItem.pity = star4Pity
            star4Pity = 0
        }
    }

    return {
        star5Pity,
        star4Pity,
        nextIs5050,
        history: history.reverse(),
    }
}
