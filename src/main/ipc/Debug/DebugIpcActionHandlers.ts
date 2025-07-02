import { IpcMainInvokeEvent } from 'electron'
import { DEBUG_IPC_ACTION } from './DebugIpcAction'
import { DbLogger } from '@/common/db/createDb'

export function createDebugIpcActionHandlers(rendererLogger: DbLogger) {
    return {
        [DEBUG_IPC_ACTION.CLIENT_LOG]: (event: IpcMainInvokeEvent, level: keyof DbLogger, ...args: Array<unknown>) => {
            rendererLogger[level](...args)
        },
    }
}
