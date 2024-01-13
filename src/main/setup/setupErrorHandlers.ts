import { LogFunctions } from 'electron-log'
import { IpcDebugEvent } from '../ipc/debug/IpcDebugEvent'
import { dispatchIpcEvent } from '../ipc/dispatchIpcEvent'

export function setupErrorHandlers(logger: LogFunctions) {
    process.on('uncaughtException', (err) => {
        logger.error(err)

        if (err instanceof Error) {
            dispatchIpcEvent(IpcDebugEvent.EXCEPTION, err.message, err.stack)
        }
    })

    process.on('unhandledRejection', (reason) => {
        logger.error(reason)

        if (reason instanceof Error) {
            dispatchIpcEvent(IpcDebugEvent.EXCEPTION, reason.message, reason.stack)
        }
    })
}
