import { IpcMainInvokeEvent, ipcMain } from 'electron'
import { LogFunctions } from 'electron-log'

export type IpcActionHandler = (event: IpcMainInvokeEvent, ...args: Array<unknown>) => unknown

export type IpcActionResult<DataType = unknown> = {
    success: true
    data: DataType
} | {
    success: false
    message: string
    stack?: string
}

export type IpcModuleOptions = {
    logger: LogFunctions
}

export abstract class IpcActionModule<ActionEnum extends string, ActionHandler> {
    constructor(
        protected mainLogger: LogFunctions,
    ) {
        // nop
    }

    protected abstract createActionHandlers(): ActionHandler

    protected shouldLogActionEvent(_key: ActionEnum): boolean {
        return true
    }

    init() {
        const actionHandlers = this.createActionHandlers() as Record<ActionEnum, IpcActionHandler>

        for (const key of Object.keys(actionHandlers) as Array<ActionEnum>) {
            ipcMain.handle(key, async(event, ...args: Array<unknown>) => {
                if (this.shouldLogActionEvent(key)) {
                    this.mainLogger.debug('[Async]', key, ...args)
                }

                try {
                    const data = await actionHandlers[key](event, ...args)
                    return createSuccessResult(data)
                } catch (err) {
                    return createErrorResult(err)
                }
            })

            ipcMain.on(key, (event, ...args: Array<unknown>) => {
                if (this.shouldLogActionEvent(key)) {
                    this.mainLogger.debug('[Sync]', key, ...args)
                }

                try {
                    const data = actionHandlers[key](event, ...args)
                    event.returnValue = createSuccessResult(data)
                } catch (err) {
                    event.returnValue = createErrorResult(err)
                }
            })
        }
    }
}

function createSuccessResult<T>(data: T): IpcActionResult<T> {
    return {
        success: true as const,
        data,
    }
}

function createErrorResult<T>(err: unknown): IpcActionResult<T> {
    return {
        success: false as const,
        message: (err instanceof Error) ? err.message : String(err),
        stack: (err instanceof Error) ? err.stack : undefined,
    }
}
