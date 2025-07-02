import { fetchWarpHistory } from './fetchWarpHistory'
import { GachaBannerType } from '@/common/StarRail'
import { deleteWarps, selectWarps } from '@/common/db/models/Warp'
import { IpcMainInvokeEvent } from 'electron'
import { parseWarps } from './parseWarps'
import { DbLogger, DrizzleClient } from '@/common/db/createDb'
import { WARP_TRACKER_IPC_ACTION } from './WarpTrackerIpcAction'

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
