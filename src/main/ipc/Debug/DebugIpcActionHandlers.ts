import { IpcMainInvokeEvent } from 'electron'
import { LogFunctions } from 'electron-log'
import { DEBUG_IPC_ACTION } from './DebugIpcAction'

export function createDebugIpcActionHandlers(rendererLogger: LogFunctions) {
    return {
        [DEBUG_IPC_ACTION.CLIENT_LOG]: (event: IpcMainInvokeEvent, level: keyof LogFunctions, ...args: Array<unknown>) => {
            rendererLogger[level](...args)
        },
    }
}
