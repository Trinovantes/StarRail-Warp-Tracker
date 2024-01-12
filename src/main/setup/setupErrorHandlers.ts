import { LogFunctions } from 'electron-log'
import { IpcDebugEvent } from '../ipc/debug/IpcDebugEvent'
import { dispatchIpcEvent } from '../ipc/dispatchIpcEvent'

export function setupErrorHandlers(logger: LogFunctions) {
    process.on('uncaughtException', (err) => {
        if (err instanceof Error) {
            logger.error(err)
            dispatchIpcEvent(IpcDebugEvent.EXCEPTION, err.message, err.stack)
        }
    })

    process.on('unhandledRejection', (reason) => {
        if (reason instanceof Error) {
            logger.error(reason)
            dispatchIpcEvent(IpcDebugEvent.EXCEPTION, reason.message, reason.stack)
        }
    })
}
