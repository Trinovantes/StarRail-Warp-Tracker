import { DEBUG_IPC_ACTION } from './Debug/DebugIpcAction'
import { DEBUG_IPC_EVENT, DebugIpcEventMap } from './Debug/DebugIpcEvent'
import { WINDOW_IPC_ACTION } from './Window/WindowIpcAction'
import { SETTING_IPC_ACTION } from './Setting/SettingIpcAction'
import { WARP_TRACKER_IPC_ACTION } from './WarpTracker/WarpTrackerIpcAction'
import type { createDebugIpcActionHandlers } from './Debug/DebugIpcActionHandlers'
import type { createWindowIpcActionHandlers } from './Window/WindowIpcActionHandlers'
import type { createWarpTrackerIpcActionHandlers } from './WarpTracker/WarpTrackerIpcActionHandlers'
import type { createSettingIpcActionHandlers } from './Setting/SettingIpcActionHandlers'

// ----------------------------------------------------------------------------
// Helpers for extending Window interface in index.d.ts
// ----------------------------------------------------------------------------

export type IpcHandlers =
    & ReturnType<typeof createDebugIpcActionHandlers>
    & ReturnType<typeof createSettingIpcActionHandlers>
    & ReturnType<typeof createWarpTrackerIpcActionHandlers>
    & ReturnType<typeof createWindowIpcActionHandlers>

export type IpcEventMap =
    DebugIpcEventMap

// ----------------------------------------------------------------------------
// Helpers for preload.ts
// ----------------------------------------------------------------------------

export const IPC_ACTIONS = [
    ...Object.values(DEBUG_IPC_ACTION),
    ...Object.values(SETTING_IPC_ACTION),
    ...Object.values(WARP_TRACKER_IPC_ACTION),
    ...Object.values(WINDOW_IPC_ACTION),
]

export const IPC_EVENTS = [
    ...Object.values(DEBUG_IPC_EVENT),
]
