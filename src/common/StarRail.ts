export const JADES_PER_WARP = 160

export enum GamePatch {
    Permanent = 'Permanent',
    v1p0 = '1.0',
    v1p1 = '1.1',
    v1p2 = '1.2',
    v1p3 = '1.3',
    v1p4 = '1.4',
    v1p5 = '1.5',
    v1p6 = '1.6',
}

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

export const WARP_BANNERS: Record<GamePatch, Array<WarpBanner>> = {
    [GamePatch.Permanent]: [
        {
            id: 1001,
            type: WarpBannerType.StellarWarp,
            name: 'Stellar Warp',
        },
        {
            id: 4001,
            type: WarpBannerType.Departure,
            name: 'Departure Warp',
        },
    ],
    [GamePatch.v1p0]: [
        {
            id: 2003,
            type: WarpBannerType.EventCharacter,
            name: 'Butterfly on Swordtip',
        },
        {
            id: 2004,
            type: WarpBannerType.EventCharacter,
            name: 'Swirl of Heavenly Spear',
        },
        {
            id: 3003,
            type: WarpBannerType.EventLightCone,
            name: '',
        },
        {
            id: 3004,
            type: WarpBannerType.EventLightCone,
            name: '',
        },
    ],
    [GamePatch.v1p1]: [
        {
            id: 2005,
            type: WarpBannerType.EventCharacter,
            name: 'Contract Zero',
        },
        {
            id: 2006,
            type: WarpBannerType.EventCharacter,
            name: 'Laic Pursuit',
        },
        {
            id: 3005,
            type: WarpBannerType.EventLightCone,
            name: '',
        },
        {
            id: 3006,
            type: WarpBannerType.EventLightCone,
            name: '',
        },
    ],
    [GamePatch.v1p2]: [
        {
            id: 2007,
            type: WarpBannerType.EventCharacter,
            name: 'A Lost Soul',
        },
        {
            id: 2008,
            type: WarpBannerType.EventCharacter,
            name: 'Nessun Dorma',
        },
        {
            id: 3007,
            type: WarpBannerType.EventLightCone,
            name: '',
        },
        {
            id: 3008,
            type: WarpBannerType.EventLightCone,
            name: '',
        },
    ],
    [GamePatch.v1p3]: [
        {
            id: 2009,
            type: WarpBannerType.EventCharacter,
            name: 'Epochal Spectrum',
        },
        {
            id: 2010,
            type: WarpBannerType.EventCharacter,
            name: 'Foreseen, Foreknown, Foretold',
        },
        {
            id: 3009,
            type: WarpBannerType.EventLightCone,
            name: '',
        },
        {
            id: 3010,
            type: WarpBannerType.EventLightCone,
            name: '',
        },
    ],
    [GamePatch.v1p4]: [
        {
            id: 2011,
            type: WarpBannerType.EventCharacter,
            name: 'Gentle Eclipse of the Moon',
        },
        {
            id: 2012,
            type: WarpBannerType.EventCharacter,
            name: 'Sunset Clause',
        },
        {
            id: 2013,
            type: WarpBannerType.EventCharacter,
            name: 'Butterfly on Swordtip',
        },
        {
            id: 3011,
            type: WarpBannerType.EventLightCone,
            name: '',
        },
        {
            id: 3012,
            type: WarpBannerType.EventLightCone,
            name: '',
        },
        {
            id: 3013,
            type: WarpBannerType.EventLightCone,
            name: '',
        },

    ],
    [GamePatch.v1p5]: [
        {
            id: 2014,
            type: WarpBannerType.EventCharacter,
            name: 'Bloom in Gloom',
        },
        {
            id: 2015,
            type: WarpBannerType.EventCharacter,
            name: 'Thorns of Scented Crown',
        },
        {
            id: 2016,
            type: WarpBannerType.EventCharacter,
            name: 'Contract Zero',
        },
        {
            id: 3014,
            type: WarpBannerType.EventLightCone,
            name: '',
        },
        {
            id: 3015,
            type: WarpBannerType.EventLightCone,
            name: '',
        },
        {
            id: 3016,
            type: WarpBannerType.EventLightCone,
            name: '',
        },
    ],
    [GamePatch.v1p6]: [
        {
            id: 2017,
            type: WarpBannerType.EventCharacter,
            name: 'Floral Triptych',
        },
        {
            id: 2018,
            type: WarpBannerType.EventCharacter,
            name: 'A Lost Soul',
        },
        {
            id: 3017,
            type: WarpBannerType.EventLightCone,
            name: 'Brilliant Fixation',
        },
        {
            id: 3018,
            type: WarpBannerType.EventLightCone,
            name: 'Bygone Reminiscence',
        },
    ],
}
