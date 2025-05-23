import { insertSetting, selectSetting } from '@/common/db/models/Setting'
import { SettingKey } from '@/common/db/models/SettingKey'
import { IpcMainInvokeEvent, dialog } from 'electron'
import { SETTING_IPC_ACTION } from './SettingIpcAction'
import { DrizzleClient } from '@/common/db/createDb'

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
