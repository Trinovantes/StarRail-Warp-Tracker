import { insertSetting, selectSetting } from '@/main/db/models/Setting'
import { SettingKey } from '@/main/db/models/SettingKey'
import { IpcMainInvokeEvent, dialog } from 'electron'
import { SettingIpcAction } from './SettingIpcAction'
import { IpcActionModule } from '../IpcActionModule'
import { LogFunctions } from 'electron-log'
import { DrizzleClient } from '@/main/db/createDb'

function createActionHandlers(db: DrizzleClient) {
    return {
        [SettingIpcAction.GET_SETTING](event: IpcMainInvokeEvent, key: SettingKey) {
            return selectSetting(db, key)
        },

        [SettingIpcAction.UPDATE_SETTING](event: IpcMainInvokeEvent, key: SettingKey, value: string) {
            return insertSetting(db, { key, value })
        },

        async [SettingIpcAction.SHOW_OPEN_DIALOG](event: IpcMainInvokeEvent, opts: Parameters<typeof dialog['showOpenDialog']>[0]) {
            return await dialog.showOpenDialog(opts)
        },
    }
}

export class SettingModule extends IpcActionModule<SettingIpcAction, ReturnType<typeof createActionHandlers>> {
    constructor(
        mainLogger: LogFunctions,
        protected db: DrizzleClient,
    ) {
        super(mainLogger)
    }

    protected override createActionHandlers() {
        return createActionHandlers(this.db)
    }
}
