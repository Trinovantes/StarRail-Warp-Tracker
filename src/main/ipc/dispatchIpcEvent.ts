import { BrowserWindow } from 'electron'
import { IpcEventMap } from '../ipc'

/**
 * Used by the main process to send events to the renderer process
 */
export function dispatchIpcEvent<K extends keyof IpcEventMap>(eventKey: K, ...args: Parameters<IpcEventMap[K]>) {
    const browsers = BrowserWindow.getAllWindows()
    for (const browser of browsers) {
        browser.webContents.send(eventKey, ...args)
    }
}
