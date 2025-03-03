import { mainWindow } from '@/main/setup/setupWindow'
import { shell } from 'electron'
import log from 'electron-log'
import { dirname } from 'node:path'
import { WINDOW_IPC_ACTION } from './WindowIpcAction'

export function createWindowIpcActionHandlers() {
    return {
        [WINDOW_IPC_ACTION.IS_MAXIMIZED]() {
            return mainWindow?.isMaximized() ?? false
        },

        [WINDOW_IPC_ACTION.CLOSE]() {
            mainWindow?.close()
        },

        [WINDOW_IPC_ACTION.MAXIMIZE]() {
            if (mainWindow?.isMaximized()) {
                mainWindow?.unmaximize()
            } else {
                mainWindow?.maximize()
            }
        },

        [WINDOW_IPC_ACTION.MINIMIZE]() {
            mainWindow?.minimize()
        },

        async [WINDOW_IPC_ACTION.OPEN_GITHUB]() {
            await shell.openExternal(DEFINE.APP_HOMEPAGE)
        },

        async [WINDOW_IPC_ACTION.OPEN_LOGS_DIR]() {
            const logFilePath = log.transports.file.getFile().path
            const logDir = dirname(logFilePath)
            await shell.openPath(logDir)
        },
    }
}
