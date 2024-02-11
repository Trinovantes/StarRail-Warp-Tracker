import { getMaxBannerPity } from '@/common/StarRail'
import { BannerWarp } from '@/main/ipc/tracker/BannerHistory'

export function getPityCssColor(bannerWarp: BannerWarp) {
    if (bannerWarp.rarity === 4) {
        return 'var(--star-4-dark)'
    }

    const maxPity = getMaxBannerPity(bannerWarp.bannerType)
    const softPityStart = maxPity - Math.floor(100 / 6) // Soft pity adds 6% per roll until soft pity reaches 100% (i.e. soft pity for 90 max pity starts at 74)

    const goodLuckThreshold = softPityStart - 10
    const avgLuckThreshold = softPityStart + 10

    if (bannerWarp.pity < goodLuckThreshold) {
        return 'var(--q-positive)'
    } else if (bannerWarp.pity < avgLuckThreshold) {
        return 'var(--q-warning)'
    } else {
        return 'var(--q-negative)'
    }
}
