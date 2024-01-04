import { initDb } from '@/main/db/initDb'
import { IpcSettingAction } from './IpcSettingAction'
import { insertSetting, selectSetting } from '@/main/db/models/Setting'
import { SettingKey } from '@/main/db/models/SettingKey'
import { IpcMainInvokeEvent, dialog } from 'electron'

export function createIpcSettingActionHandler(db: Awaited<ReturnType<typeof initDb>>) {
    return {
        [IpcSettingAction.GET_SETTING](event: IpcMainInvokeEvent, key: SettingKey) {
            return selectSetting(db, key)
        },

        [IpcSettingAction.UPDATE_SETTING](event: IpcMainInvokeEvent, key: SettingKey, value: string) {
            return insertSetting(db, { key, value })
        },

        async [IpcSettingAction.SHOW_OPEN_DIALOG](event: IpcMainInvokeEvent, opts: Parameters<typeof dialog['showOpenDialog']>[0]) {
            return await dialog.showOpenDialog(opts)
        },
    }
}
