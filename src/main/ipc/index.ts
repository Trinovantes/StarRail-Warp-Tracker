import { DebugIpcAction } from './Debug/DebugIpcAction'
import { DebugIpcEventMap, DebugIpcEvent } from './Debug/DebugIpcEvent'
import { DebugModule } from './Debug/DebugModule'
import { SettingIpcAction } from './Setting/SettingIpcAction'
import { SettingModule } from './Setting/SettingModule'
import { WarpTrackerIpcAction } from './WarpTracker/WarpTrackerIpcAction'
import { WarpTrackerModule } from './WarpTracker/WarpTrackerModule'
import { WindowIpcAction } from './Window/WindowIpcAction'
import { WindowModule } from './Window/WindowModule'

// ----------------------------------------------------------------------------
// Helpers for extending Window interface in index.d.ts
// ----------------------------------------------------------------------------

export type IpcActionHandlers =
    & ReturnType<DebugModule['createActionHandlers']>
    & ReturnType<WindowModule['createActionHandlers']>
    & ReturnType<SettingModule['createActionHandlers']>
    & ReturnType<WarpTrackerModule['createActionHandlers']>

export type IpcEventMap =
    DebugIpcEventMap

// ----------------------------------------------------------------------------
// Helpers for preload.ts
// ----------------------------------------------------------------------------

export const ipcActions = [
    ...Object.values(DebugIpcAction),
    ...Object.values(WindowIpcAction),
    ...Object.values(SettingIpcAction),
    ...Object.values(WarpTrackerIpcAction),
]

export const ipcEvents = [
    ...Object.values(DebugIpcEvent),
]
