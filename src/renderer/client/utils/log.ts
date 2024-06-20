import { DebugIpcAction } from '@/main/ipc/Debug/DebugIpcAction'

export function logInfo(...args: Array<unknown>) {
    void window.api[DebugIpcAction.LOG]('info', ...args)
}

export function logWarn(...args: Array<unknown>) {
    void window.api[DebugIpcAction.LOG]('warn', ...args)
}

export function logError(...args: Array<unknown>) {
    void window.api[DebugIpcAction.LOG]('error', ...args)
}
