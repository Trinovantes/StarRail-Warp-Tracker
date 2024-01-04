import { mainWindow } from '@/main/setup/setupWindow'
import { IpcWindowAction } from './IpcWindowAction'
import { shell } from 'electron'

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
    }
}
