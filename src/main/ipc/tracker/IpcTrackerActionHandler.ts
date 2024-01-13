import { initDb } from '@/main/db/initDb'
import { IpcTrackerAction } from './IpcTrackerAction'
import { getAuthKey } from './getAuthKey'
import { selectSetting } from '@/main/db/models/Setting'
import { SettingKey } from '@/main/db/models/SettingKey'
import { fetchWarpHistory } from './fetchWarpHistory'
import { WarpBannerType } from '@/common/StarRail'
import { LogFunctions } from 'electron-log'
import { FETCH_DELAY } from '@/common/Constants'
import { sleep } from '@/common/utils/sleep'
import { deleteWarps, existsWarp, insertWarp, selectWarps } from '@/main/db/models/Warp'
import { IpcMainInvokeEvent } from 'electron'
import { parseWarps } from './parseWarps'

export function createIpcTrackerActionHandler(db: Awaited<ReturnType<typeof initDb>>, logger: LogFunctions) {
    return {
        [IpcTrackerAction.CLEAR_WARPS](event: IpcMainInvokeEvent, bannerType: WarpBannerType) {
            return deleteWarps(db, bannerType)
        },

        [IpcTrackerAction.GET_WARPS](event: IpcMainInvokeEvent, bannerType: WarpBannerType) {
            const warps = selectWarps(db, bannerType)
            return parseWarps(warps)
        },

        async [IpcTrackerAction.REFRESH_WARPS](event: IpcMainInvokeEvent, bannerType: WarpBannerType) {
            const gameDir = selectSetting(db, SettingKey.GAME_INSTALL_DIR)
            if (!gameDir) {
                const errMsg = 'Missing game install directory setting'
                logger.warn(errMsg)
                throw new Error(errMsg)
            }

            const authKey = getAuthKey(gameDir, Boolean(process.env.WSL_DISTRO_NAME), logger)

            let endId: string | undefined
            while (true) {
                const warps = await fetchWarpHistory(bannerType, authKey, endId, logger)

                // Save search state before inserting
                endId = warps.at(-1)?.id
                const lastWarpAlreadySaved = existsWarp(db, endId)

                logger.info(`Fetched ${warps.length} Warp Records endId:${endId} lastWarpAlreadySaved:${lastWarpAlreadySaved}`)

                // Always save results (ignores conflicts)
                for (const warp of warps) {
                    insertWarp(db, warp)
                }

                if (warps.length === 0) {
                    break
                }
                if (lastWarpAlreadySaved) {
                    break
                }

                await sleep(FETCH_DELAY)
            }

            const warps = selectWarps(db, bannerType)
            return parseWarps(warps)
        },
    }
}
