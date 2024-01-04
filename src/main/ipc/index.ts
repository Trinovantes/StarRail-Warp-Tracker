import { IpcDebugEvent, IpcDebugEventMap } from './debug/IpcDebugEvent'
import { IpcDebugAction } from './debug/IpcDebugAction'
import { IpcWindowAction } from './window/IpcWindowAction'
import { IpcSettingAction } from './setting/IpcSettingAction'
import { IpcTrackerAction } from './tracker/IpcTrackerAction'
import { createIpcDebugActionHandler } from './debug/IpcDebugActionHandler'
import { createIpcSettingActionHandler } from './setting/IpcSettingActionHandler'
import { createIpcTrackerActionHandler } from './tracker/IpcTrackerActionHandler'
import { createIpcWindowActionHandler } from './window/IpcWindowActionHandler'

// ----------------------------------------------------------------------------
// Helpers for extending Window interface in index.d.ts
// ----------------------------------------------------------------------------

export type IpcActionMap =
    & ReturnType<typeof createIpcWindowActionHandler>
    & ReturnType<typeof createIpcDebugActionHandler>
    & ReturnType<typeof createIpcSettingActionHandler>
    & ReturnType<typeof createIpcTrackerActionHandler>

export type IpcEventMap =
    & IpcDebugEventMap

// ----------------------------------------------------------------------------
// Helpers for preload::exposeIpc*
// ----------------------------------------------------------------------------

export const ipcActions = [
    ...Object.values(IpcWindowAction),
    ...Object.values(IpcDebugAction),
    ...Object.values(IpcSettingAction),
    ...Object.values(IpcTrackerAction),
]

export const ipcEvents = [
    ...Object.values(IpcDebugEvent),
]
