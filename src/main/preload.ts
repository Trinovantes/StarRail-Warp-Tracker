/**
 * This file is executed in the browser context with some additional priveledges
 */

import { contextBridge, ipcRenderer } from 'electron'
import { ipcActions, ipcEvents } from './ipc'
import { ActionResult } from './ipc/ActionResult'

function exposeIpcActions() {
    const exposedActions: Record<string, (...args: Array<unknown>) => Promise<ActionResult<unknown>>> = {}

    for (const actionKey of ipcActions) {
        exposedActions[actionKey] = (...args) => {
            return ipcRenderer.invoke(actionKey, ...args) as Promise<ActionResult<unknown>>
        }
    }

    contextBridge.exposeInMainWorld('api', exposedActions)
}

function exposeIpcEvents() {
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

exposeIpcActions()
exposeIpcEvents()
