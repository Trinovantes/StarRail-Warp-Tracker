import { getAuthKey } from './getAuthKey'
import { selectSetting } from '@/main/db/models/Setting'
import { fetchWarpHistory } from './fetchWarpHistory'
import { GachaBannerType, WarpId } from '@/common/StarRail'
import { LogFunctions } from 'electron-log'
import { FETCH_DELAY } from '@/common/Constants'
import { sleep } from '@/common/utils/sleep'
import { deleteWarps, existsWarp, insertWarp, selectWarps } from '@/main/db/models/Warp'
import { IpcMainInvokeEvent } from 'electron'
import { parseWarps } from './parseWarps'
import { DrizzleClient } from '@/main/db/createDb'
import { WARP_TRACKER_IPC_ACTION } from './WarpTrackerIpcAction'

export function createWarpTrackerIpcActionHandlers(logger: LogFunctions, db: DrizzleClient) {
    return {
        [WARP_TRACKER_IPC_ACTION.CLEAR_WARPS](event: IpcMainInvokeEvent, bannerType: GachaBannerType) {
            return deleteWarps(db, bannerType)
        },

        [WARP_TRACKER_IPC_ACTION.GET_WARPS](event: IpcMainInvokeEvent, bannerType: GachaBannerType) {
            const warps = selectWarps(db, bannerType)
            return parseWarps(warps)
        },

        async [WARP_TRACKER_IPC_ACTION.REFRESH_WARPS](event: IpcMainInvokeEvent, bannerType: GachaBannerType) {
            const gameDir = selectSetting(db, 'GAME_INSTALL_DIR')
            if (!gameDir) {
                const errMsg = 'Missing game install directory setting'
                logger.warn(errMsg)
                throw new Error(errMsg)
            }

            const authKey = getAuthKey(gameDir, Boolean(process.env.WSL_DISTRO_NAME), logger)

            let endId: WarpId | undefined
            while (true) {
                const warps = await fetchWarpHistory(logger, bannerType, authKey, endId)

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
