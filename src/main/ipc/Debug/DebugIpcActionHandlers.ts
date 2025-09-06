import type { IpcMainInvokeEvent } from 'electron'
import type { DbLogger } from '../../../common/db/createDb.ts'
import { DEBUG_IPC_ACTION } from './DebugIpcAction.ts'

export function createDebugIpcActionHandlers(rendererLogger: DbLogger) {
    return {
        [DEBUG_IPC_ACTION.CLIENT_LOG]: (event: IpcMainInvokeEvent, level: keyof DbLogger, ...args: Array<unknown>) => {
            rendererLogger[level](...args)
        },
    }
}
