import { BannerWarp } from '@/main/ipc/tracker/BannerHistory'

export function getPityCssColor(bannerWarp: BannerWarp) {
    if (bannerWarp.rarity === 4) {
        return 'var(--star-4-dark)'
    }

    if (bannerWarp.pity < 50) {
        return 'var(--q-positive)'
    } else if (bannerWarp.pity < 75) {
        return 'var(--q-warning)'
    } else {
        return 'var(--q-negative)'
    }
}
