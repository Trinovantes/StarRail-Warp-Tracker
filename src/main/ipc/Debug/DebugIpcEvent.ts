export enum DebugIpcEvent {
    EXCEPTION = 'DebugIpcEvent_EXCEPTION',
}

export type DebugIpcEventMap = {
    [DebugIpcEvent.EXCEPTION]: (errorName: string, callStack?: string) => void
}
