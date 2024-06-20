import { mainWindow } from '@/main/setup/setupWindow'
import { shell } from 'electron'
import log from 'electron-log'
import { dirname } from 'node:path'
import { WindowIpcAction } from './WindowIpcAction'
import { IpcActionModule } from '../IpcActionModule'

function createActionHandlers() {
    return {
        [WindowIpcAction.IS_MAXIMIZED]() {
            return mainWindow?.isMaximized() ?? false
        },

        [WindowIpcAction.CLOSE]() {
            mainWindow?.close()
        },

        [WindowIpcAction.MAXIMIZE]() {
            if (mainWindow?.isMaximized()) {
                mainWindow?.unmaximize()
            } else {
                mainWindow?.maximize()
            }
        },

        [WindowIpcAction.MINIMIZE]() {
            mainWindow?.minimize()
        },

        async [WindowIpcAction.OPEN_GITHUB]() {
            await shell.openExternal(DEFINE.APP_HOMEPAGE)
        },

        async [WindowIpcAction.OPEN_LOGS_DIR]() {
            const logFilePath = log.transports.file.getFile().path
            const logDir = dirname(logFilePath)
            await shell.openPath(logDir)
        },
    }
}

export class WindowModule extends IpcActionModule<WindowIpcAction, ReturnType<typeof createActionHandlers>> {
    protected override shouldLogActionEvent(key: WindowIpcAction) {
        return key !== WindowIpcAction.IS_MAXIMIZED
    }

    protected override createActionHandlers() {
        return createActionHandlers()
    }
}
