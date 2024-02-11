import { mainWindow } from '@/main/setup/setupWindow'
import { IpcWindowAction } from './IpcWindowAction'
import { shell } from 'electron'
import log from 'electron-log'
import { dirname } from 'node:path'

export function createIpcWindowActionHandler() {
    return {
        [IpcWindowAction.IS_MAXIMIZED]() {
            return mainWindow?.isMaximized() ?? false
        },

        [IpcWindowAction.CLOSE]() {
            mainWindow?.close()
        },

        [IpcWindowAction.MAXIMIZE]() {
            if (mainWindow?.isMaximized()) {
                mainWindow?.unmaximize()
            } else {
                mainWindow?.maximize()
            }
        },

        [IpcWindowAction.MINIMIZE]() {
            mainWindow?.minimize()
        },

        async [IpcWindowAction.OPEN_GITHUB]() {
            await shell.openExternal(DEFINE.APP_HOMEPAGE)
        },

        async [IpcWindowAction.OPEN_LOGS_DIR]() {
            const logFilePath = log.transports.file.getFile().path
            const logDir = dirname(logFilePath)
            await shell.openPath(logDir)
        },
    }
}
