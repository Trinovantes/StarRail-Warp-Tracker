import { DebugIpcEvent } from '../ipc/Debug/DebugIpcEvent'
import { dispatchIpcEvent } from '../ipc/dispatchIpcEvent'

export function setupErrorHandlers() {
    process.on('uncaughtException', (err) => {
        if (err instanceof Error) {
            dispatchIpcEvent(DebugIpcEvent.EXCEPTION, err.message, err.stack)
        }
    })

    process.on('unhandledRejection', (reason) => {
        if (reason instanceof Error) {
            dispatchIpcEvent(DebugIpcEvent.EXCEPTION, reason.message, reason.stack)
        }
    })
}
