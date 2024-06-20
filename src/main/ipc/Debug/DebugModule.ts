import { IpcMainInvokeEvent } from 'electron'
import { DebugIpcAction } from './DebugIpcAction'
import { LogFunctions } from 'electron-log'
import { IpcActionModule } from '../IpcActionModule'

function createActionHandlers(rendererLogger: LogFunctions) {
    return {
        [DebugIpcAction.LOG](event: IpcMainInvokeEvent, level: keyof LogFunctions, ...args: Array<unknown>) {
            rendererLogger?.[level](...args)
        },
    }
}

export class DebugModule extends IpcActionModule<DebugIpcAction, ReturnType<typeof createActionHandlers>> {
    constructor(
        mainLogger: LogFunctions,
        protected rendererLogger: LogFunctions,
    ) {
        super(mainLogger)
    }

    protected override shouldLogActionEvent(key: DebugIpcAction) {
        return key !== DebugIpcAction.LOG
    }

    protected override createActionHandlers() {
        return createActionHandlers(this.rendererLogger)
    }
}
