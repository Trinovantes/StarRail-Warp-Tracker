import { DEBUG_IPC_EVENT } from '../ipc/Debug/DebugIpcEvent.ts'
import { dispatchIpcEvent } from '../ipc/dispatchIpcEvent.ts'

export function setupErrorHandlers() {
    process.on('uncaughtException', (err) => {
        if (err instanceof Error) {
            dispatchIpcEvent(DEBUG_IPC_EVENT.SERVER_EXCEPTION, err.message, err.stack)
        }
    })

    process.on('unhandledRejection', (reason) => {
        if (reason instanceof Error) {
            dispatchIpcEvent(DEBUG_IPC_EVENT.SERVER_EXCEPTION, reason.message, reason.stack)
        }
    })
}
