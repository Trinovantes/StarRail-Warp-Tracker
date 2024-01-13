export const JADES_PER_WARP = 160

export enum WarpBannerType {
    StellarWarp = '1',
    Departure = '2', // Beginner banner
    EventCharacter = '11',
    EventLightCone = '12',
}

export enum WarpItemType {
    Character = 'Character',
    LightCone = 'Light Cone',
}

export type WarpBanner = {
    id: number
    type: WarpBannerType
    name: string
}

export function getMaxBannerPity(bannerType: WarpBannerType): number {
    switch (bannerType) {
        case WarpBannerType.EventCharacter: return 90
        case WarpBannerType.EventLightCone: return 80
        case WarpBannerType.Departure: return 50
        case WarpBannerType.StellarWarp: return 90
    }
}

export function isLimitedBanner5Star(itemId: string): boolean {
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
        case '25': // Himeko
        case '16': // Welt
        case '34': // Bronya
        case '24': // Gepard
        case '32': // Clara
        case '40': // Yanqing
        case '41': // Bailu
            return false
    }

    return true
}
