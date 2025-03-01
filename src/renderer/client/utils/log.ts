import { DEBUG_IPC_ACTION } from '@/main/ipc/Debug/DebugIpcAction'

export function logInfo(...args: Array<unknown>) {
    void window.api[DEBUG_IPC_ACTION.CLIENT_LOG]('info', ...args)
}

export function logWarn(...args: Array<unknown>) {
    void window.api[DEBUG_IPC_ACTION.CLIENT_LOG]('warn', ...args)
}

export function logError(...args: Array<unknown>) {
    void window.api[DEBUG_IPC_ACTION.CLIENT_LOG]('error', ...args)
}
