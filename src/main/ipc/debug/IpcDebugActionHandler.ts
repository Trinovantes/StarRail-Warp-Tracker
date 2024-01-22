import { LogFunctions } from 'electron-log'
import { IpcMainInvokeEvent } from 'electron'
import { IpcDebugAction } from './IpcDebugAction'

type LogLevel = keyof LogFunctions

export function createIpcDebugActionHandler(rendererLogger?: LogFunctions) {
    return {
        [IpcDebugAction.LOG](event: IpcMainInvokeEvent, level: LogLevel, ...args: Array<unknown>) {
            rendererLogger?.[level](...args)
        },
    }
}
