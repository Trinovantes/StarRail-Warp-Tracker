import { ipcRenderer, contextBridge } from 'electron'
import { IpcActionResult } from './ipc/IpcActionModule'
import { ipcActions, ipcEvents } from './ipc'

const exposeHandlers = () => {
    const exposedAsyncActions: Record<string, (...args: Array<unknown>) => Promise<IpcActionResult<unknown>>> = {}
    const exposedSyncActions: Record<string, (...args: Array<unknown>) => IpcActionResult<unknown>> = {}

    for (const actionKey of ipcActions) {
        exposedAsyncActions[actionKey] = (...args) => {
            return ipcRenderer.invoke(actionKey, ...args) as Promise<IpcActionResult<unknown>>
        }
        exposedSyncActions[actionKey] = (...args) => {
            return ipcRenderer.sendSync(actionKey, ...args) as IpcActionResult<unknown>
        }
    }

    contextBridge.exposeInMainWorld('api', exposedAsyncActions)
    contextBridge.exposeInMainWorld('syncApi', exposedSyncActions)
}

const exposeEvents = () => {
    const onEvents: Record<string, (listener: (...args: Array<unknown>) => void) => void> = {}
    const offEvents: Record<string, (listener: (...args: Array<unknown>) => void) => void> = {}

    for (const actionKey of ipcEvents) {
        onEvents[actionKey] = (listener) => {
            ipcRenderer.on(actionKey, listener)
        }
        offEvents[actionKey] = (listener) => {
            ipcRenderer.off(actionKey, listener)
        }
    }

    contextBridge.exposeInMainWorld('onEvent', onEvents)
    contextBridge.exposeInMainWorld('offEvent', offEvents)
}

exposeHandlers()
exposeEvents()
