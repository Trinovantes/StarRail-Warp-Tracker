import { WarpItemType } from '@/common/StarRail'
import { BannerWarp } from '@/main/ipc/tracker/BannerHistory'

export function getItemIcon(bannerWarp: BannerWarp): string {
    switch (bannerWarp.itemType) {
        case WarpItemType.Character:
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-require-imports
            return require(`@/renderer/client/assets/img/game/icon/character/${bannerWarp.itemId}.png`)

        case WarpItemType.LightCone:
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-require-imports
            return require(`@/renderer/client/assets/img/game/icon/light_cone/${bannerWarp.itemId}.png`)

        default:
            return ''
    }
}
