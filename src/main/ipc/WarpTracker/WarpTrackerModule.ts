import { initDb } from '@/main/db/initDb'
import { WarpTrackerIpcAction } from './WarpTrackerIpcAction'
import { getAuthKey } from './getAuthKey'
import { selectSetting } from '@/main/db/models/Setting'
import { SettingKey } from '@/main/db/models/SettingKey'
import { fetchWarpHistory } from './fetchWarpHistory'
import { GachaBannerType, WarpId } from '@/common/StarRail'
import { LogFunctions } from 'electron-log'
import { FETCH_DELAY } from '@/common/Constants'
import { sleep } from '@/common/utils/sleep'
import { deleteWarps, existsWarp, insertWarp, selectWarps } from '@/main/db/models/Warp'
import { IpcMainInvokeEvent } from 'electron'
import { parseWarps } from './parseWarps'
import { IpcActionModule } from '../IpcActionModule'
import { DrizzleClient } from '@/main/db/createDb'

function createActionHandlers(logger: LogFunctions, db: Awaited<ReturnType<typeof initDb>>) {
    return {
        [WarpTrackerIpcAction.CLEAR_WARPS](event: IpcMainInvokeEvent, bannerType: GachaBannerType) {
            return deleteWarps(db, bannerType)
        },

        [WarpTrackerIpcAction.GET_WARPS](event: IpcMainInvokeEvent, bannerType: GachaBannerType) {
            const warps = selectWarps(db, bannerType)
            return parseWarps(warps)
        },

        async [WarpTrackerIpcAction.REFRESH_WARPS](event: IpcMainInvokeEvent, bannerType: GachaBannerType) {
            const gameDir = selectSetting(db, SettingKey.GAME_INSTALL_DIR)
            if (!gameDir) {
                const errMsg = 'Missing game install directory setting'
                logger.warn(errMsg)
                throw new Error(errMsg)
            }

            const authKey = getAuthKey(gameDir, Boolean(process.env.WSL_DISTRO_NAME), logger)

            let endId: WarpId | undefined
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

export class WarpTrackerModule extends IpcActionModule<WarpTrackerIpcAction, ReturnType<typeof createActionHandlers>> {
    constructor(
        mainLogger: LogFunctions,
        protected db: DrizzleClient,
    ) {
        super(mainLogger)
    }

    protected override createActionHandlers() {
        return createActionHandlers(this.mainLogger, this.db)
    }
}
