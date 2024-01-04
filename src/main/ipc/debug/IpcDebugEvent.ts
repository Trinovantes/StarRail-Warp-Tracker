export enum IpcDebugEvent {
    EXCEPTION = 'IpcDebugEvent_EXCEPTION',
}

export type IpcDebugEventMap = {
    [IpcDebugEvent.EXCEPTION]: (errorName: string, callStack?: string) => void
}
