import defaultIcon from '@img/default-item.png'
import type { BannerWarp } from '../../../../main/ipc/WarpTracker/parseWarps.ts'

// ----------------------------------------------------------------------------
// Load Data
// ----------------------------------------------------------------------------

function getCharacterIcons() {
    const imgReq = require.context('@img/game/icon/character/', false, /\.png$/i)
    const images = new Map<string, string>()

    for (const imageName of imgReq.keys()) {
        const imgPath = imgReq(imageName) as string
        const itemId = imageName.replace(/\.\/(?<itemId>\d+)\.png/, '$<itemId>')
        images.set(itemId, imgPath)
    }

    return images
}

function getLightConeIcons() {
    const imgReq = require.context('@img/game/icon/light_cone/', false, /\.png$/i)
    const images = new Map<string, string>()

    for (const imageName of imgReq.keys()) {
        const imgPath = imgReq(imageName) as string
        const itemId = imageName.replace(/\.\/(?<itemId>\d+)\.png/, '$<itemId>')
        images.set(itemId, imgPath)
    }

    return images
}

const characterIcons = getCharacterIcons()
const lightConeIcons = getLightConeIcons()

// ----------------------------------------------------------------------------
// Exports
// ----------------------------------------------------------------------------

export function getItemIcon(bannerWarp: BannerWarp): string {
    switch (bannerWarp.itemType) {
        case 'Character':
            return characterIcons.get(bannerWarp.itemId) ?? defaultIcon

        case 'Light Cone':
            return lightConeIcons.get(bannerWarp.itemId) ?? defaultIcon

        default:
            return defaultIcon
    }
}
