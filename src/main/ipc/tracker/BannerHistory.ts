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
