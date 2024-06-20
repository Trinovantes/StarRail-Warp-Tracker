import { Brand } from '@/@types/Brand'

export type WarpId = Brand<string, 'WarpId'>
export type UserId = Brand<string, 'UserId'>
export type BannerId = Brand<string, 'BannerId'> // Unique per banner/patch (reruns of same character have different ids)
export type ItemId = Brand<string, 'ItemId'>
export type Rarity = Brand<3 | 4 | 5, 'Rarity'>

export const JADES_PER_WARP = 160

export enum WarpItemType {
    Character = 'Character',
    LightCone = 'Light Cone',
}

export enum GachaBannerType {
    StellarWarp = '1',
    Departure = '2', // Beginner banner
    EventCharacter = '11',
    EventLightCone = '12',
}

export type GachaBanner = {
    id: number
    type: GachaBannerType
    name: string
}

export function getMaxBannerPity(bannerType: GachaBannerType): number {
    switch (bannerType) {
        case GachaBannerType.EventCharacter: return 90
        case GachaBannerType.EventLightCone: return 80
        case GachaBannerType.Departure: return 50
        case GachaBannerType.StellarWarp: return 90
    }
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
