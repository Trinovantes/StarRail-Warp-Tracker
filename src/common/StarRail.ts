import { Brand } from '@/@types/Brand'

export type WarpId = Brand<string, 'WarpId'>
export type UserId = Brand<string, 'UserId'>
export type BannerId = Brand<string, 'BannerId'> // Unique per banner/patch (reruns of same character have different ids)
export type ItemId = Brand<string, 'ItemId'>
export type Rarity = Brand<3 | 4 | 5, 'Rarity'>
export type GachaItemType = Brand<string, 'GachaItemType'>
export type GachaBannerType = Brand<string, 'GachaBannerType'>

export const JADES_PER_WARP = 160

export const ALL_GACHA_ITEM_TYPES = [
    'Character' as GachaItemType,
    'Light Cone' as GachaItemType,
]

export const GACHA_BANNER_TYPE_STANDARD = '1' as GachaBannerType
export const GACHA_BANNER_TYPE_BEGINNER = '2' as GachaBannerType
export const GACHA_BANNER_TYPE_LIMITED_CHARACTER = '11' as GachaBannerType
export const GACHA_BANNER_TYPE_LIMITED_LIGHT_CONE = '12' as GachaBannerType

export const ALL_GACHA_BANNERS = [
    {
        type: GACHA_BANNER_TYPE_LIMITED_CHARACTER,
        label: 'Character',
        caption: 'Limited banner',
        icon: 'play_circle',
    },
    {
        type: GACHA_BANNER_TYPE_LIMITED_LIGHT_CONE,
        label: 'Light Cone',
        caption: 'Limited banner',
        icon: 'confirmation_number',
    },
    {
        type: GACHA_BANNER_TYPE_BEGINNER,
        label: 'Departure Warp',
        caption: 'Beginner 50-pull banner',
        icon: 'smartphone',
    },
    {
        type: GACHA_BANNER_TYPE_STANDARD,
        label: 'Stellar Warp',
        caption: 'Permanent banner',
        icon: 'person',
    },
] as const

export function getMaxBannerPity(bannerType: GachaBannerType): number {
    switch (bannerType) {
        case GACHA_BANNER_TYPE_STANDARD: return 90
        case GACHA_BANNER_TYPE_BEGINNER: return 50
        case GACHA_BANNER_TYPE_LIMITED_CHARACTER: return 90
        case GACHA_BANNER_TYPE_LIMITED_LIGHT_CONE: return 80
    }

    throw new Error(`Invalid bannerType:${bannerType}`)
}

export function isLimitedBanner5Star(itemId: ItemId): boolean {
    // Characters
    switch (itemId) {
        case '1003': // Himeko
        case '1004': // Welt
        case '1101': // Bronya
        case '1104': // Gepard
        case '1107': // Clara
        case '1209': // Yanqing
        case '1211': // Bailu
            return false
    }

    // Light Cones
    switch (itemId) {
        case '23000': // Himeko
        case '23004': // Welt
        case '23003': // Bronya
        case '23005': // Gepard
        case '23002': // Clara
        case '23012': // Yanqing
        case '23013': // Bailu
            return false
    }

    return true
}
