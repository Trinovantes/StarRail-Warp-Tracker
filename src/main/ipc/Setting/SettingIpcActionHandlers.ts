import { type IpcMainInvokeEvent, dialog } from 'electron'
import type { DrizzleClient } from '../../../common/db/createDb.ts'
import { selectSetting, insertSetting } from '../../../common/db/models/Setting.ts'
import type { SettingKey } from '../../../common/db/models/SettingKey.ts'
import { SETTING_IPC_ACTION } from './SettingIpcAction.ts'

export function createSettingIpcActionHandlers(db: DrizzleClient) {
    return {
        [SETTING_IPC_ACTION.GET_SETTING](event: IpcMainInvokeEvent, key: SettingKey) {
            return selectSetting(db, key)
        },

        [SETTING_IPC_ACTION.UPDATE_SETTING](event: IpcMainInvokeEvent, key: SettingKey, value: string) {
            return insertSetting(db, { key, value })
        },

        async [SETTING_IPC_ACTION.SHOW_OPEN_DIALOG](event: IpcMainInvokeEvent, opts: Parameters<typeof dialog['showOpenDialog']>[0]) {
            return await dialog.showOpenDialog(opts)
        },
    }
}
