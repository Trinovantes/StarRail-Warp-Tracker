export const DEBUG_IPC_EVENT = Object.freeze({
    SERVER_EXCEPTION: 'DEBUG_IPC_EVENT_SERVER_EXCEPTION',
})

export type DebugIpcEventMap = {
    [DEBUG_IPC_EVENT.SERVER_EXCEPTION]: (errorName: string, callStack?: string) => void
}
