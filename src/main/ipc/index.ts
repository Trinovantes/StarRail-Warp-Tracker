import { DEBUG_IPC_ACTION } from './Debug/DebugIpcAction.ts'
import { DEBUG_IPC_EVENT, type DebugIpcEventMap } from './Debug/DebugIpcEvent.ts'
import { WINDOW_IPC_ACTION } from './Window/WindowIpcAction.ts'
import { SETTING_IPC_ACTION } from './Setting/SettingIpcAction.ts'
import { WARP_TRACKER_IPC_ACTION } from './WarpTracker/WarpTrackerIpcAction.ts'
import type { createDebugIpcActionHandlers } from './Debug/DebugIpcActionHandlers.ts'
import type { createWindowIpcActionHandlers } from './Window/WindowIpcActionHandlers.ts'
import type { createWarpTrackerIpcActionHandlers } from './WarpTracker/WarpTrackerIpcActionHandlers.ts'
import type { createSettingIpcActionHandlers } from './Setting/SettingIpcActionHandlers.ts'

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
