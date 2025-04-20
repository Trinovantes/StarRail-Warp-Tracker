import { ExpectedError } from '@/common/node/ExpectedError'
import { IpcMainInvokeEvent, ipcMain } from 'electron'

export type IpcActionHandler = (event: IpcMainInvokeEvent, ...args: Array<unknown>) => unknown

export type IpcActionResult<DataType = unknown> = {
    success: true
    data: DataType
} | {
    success: false
    errTitle: string
    errMsg?: string
    errStack?: string
}

export function registerIpcActionHandlers(actionHandlers: Record<string, IpcActionHandler>) {
    for (const key of Object.keys(actionHandlers)) {
        ipcMain.handle(key, async(event, ...args: Array<unknown>) => {
            try {
                const data = await actionHandlers[key](event, ...args)
                return createSuccessResult(data)
            } catch (err) {
                return createErrorResult(err)
            }
        })

        ipcMain.on(key, (event, ...args: Array<unknown>) => {
            try {
                const data = actionHandlers[key](event, ...args)
                event.returnValue = createSuccessResult(data)
            } catch (err) {
                event.returnValue = createErrorResult(err)
            }
        })
    }
}

function createSuccessResult<T>(data: T): IpcActionResult<T> {
    return {
        success: true,
        data,
    }
}

function createErrorResult<T>(err: unknown): IpcActionResult<T> {
    if (err instanceof ExpectedError) {
        return {
            success: false,
            errTitle: err.dialogTitle,
            errMsg: err.dialogMsg,
            errStack: err.stack,
        }
    } else if (err instanceof Error) {
        return {
            success: false,
            errTitle: err.message,
            errStack: err.stack,
        }
    } else {
        return {
            success: false,
            errTitle: String(err),
        }
    }
}
