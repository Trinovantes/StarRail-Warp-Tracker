import type { IpcMainInvokeEvent } from 'electron'
import type { DbLogger, DrizzleClient } from '../../../common/db/createDb.ts'
import { deleteWarps, selectWarps } from '../../../common/db/models/Warp.ts'
import type { GachaBannerType } from '../../../common/StarRail.ts'
import { fetchWarpHistory } from './fetchWarpHistory.ts'
import { parseWarps } from './parseWarps.ts'
import { WARP_TRACKER_IPC_ACTION } from './WarpTrackerIpcAction.ts'

export function createWarpTrackerIpcActionHandlers(logger: DbLogger, db: DrizzleClient) {
    return {
        [WARP_TRACKER_IPC_ACTION.CLEAR_WARPS](event: IpcMainInvokeEvent, bannerType: GachaBannerType) {
            return deleteWarps(db, bannerType)
        },

        [WARP_TRACKER_IPC_ACTION.GET_WARPS](event: IpcMainInvokeEvent, bannerType: GachaBannerType) {
            const warps = selectWarps(db, bannerType)
            return parseWarps(warps)
        },

        async [WARP_TRACKER_IPC_ACTION.REFRESH_WARPS](event: IpcMainInvokeEvent, bannerType: GachaBannerType) {
            await fetchWarpHistory(db, bannerType, logger)
            const warps = selectWarps(db, bannerType)
            return parseWarps(warps)
        },
    }
}
