import { ipcMain } from 'electron'
import { ActionHandler } from '../ipc/ActionHandler'
import { ActionResult } from '../ipc/ActionResult'
import { IpcDebugAction } from '../ipc/debug/IpcDebugAction'
import { IpcWindowAction } from '../ipc/window/IpcWindowAction'
import { IpcSettingAction } from '../ipc/setting/IpcSettingAction'
import { IpcTrackerAction } from '../ipc/tracker/IpcTrackerAction'
import { LogFunctions } from 'electron-log'
import { createIpcDebugActionHandler } from '../ipc/debug/IpcDebugActionHandler'
import { createIpcSettingActionHandler } from '../ipc/setting/IpcSettingActionHandler'
import { createIpcTrackerActionHandler } from '../ipc/tracker/IpcTrackerActionHandler'
import { createIpcWindowActionHandler } from '../ipc/window/IpcWindowActionHandler'
import { DrizzleClient } from '../db/createDb'

export function setupIpc(db: DrizzleClient, mainLogger: LogFunctions, rendererLogger: LogFunctions) {
    registerIpcHandler(mainLogger, IpcWindowAction, createIpcWindowActionHandler())
    registerIpcHandler(mainLogger, IpcDebugAction, createIpcDebugActionHandler(rendererLogger))
    registerIpcHandler(mainLogger, IpcSettingAction, createIpcSettingActionHandler(db))
    registerIpcHandler(mainLogger, IpcTrackerAction, createIpcTrackerActionHandler(db, mainLogger))
}

// Do not log these calls from the renderer process
const skipLogKeys = new Set<string>([
    IpcWindowAction.IS_MAXIMIZED,
    IpcDebugAction.LOG,
])

function registerIpcHandler<RuntimeEnum extends Record<string, string>>(logger: LogFunctions, runtimeEnum: RuntimeEnum, handler: ActionHandler<RuntimeEnum>) {
    const keys = Object.values(runtimeEnum) as Array<RuntimeEnum[keyof RuntimeEnum]>

    for (const key of keys) {
        ipcMain.handle(key, async(...args): Promise<ActionResult<unknown>> => {
            if (!skipLogKeys.has(key)) {
                logger.debug(key, args.slice(1))
            }

            try {
                const res: ActionResult<unknown> = {
                    success: true as const,
                    data: await handler[key](...args),
                }

                return res
            } catch (err) {
                const res: ActionResult<unknown> = {
                    success: false as const,
                    message: (err instanceof Error) ? err.message : String(err),
                    stack: (err instanceof Error) ? err.stack : undefined,
                }

                return res
            }
        })
    }
}
