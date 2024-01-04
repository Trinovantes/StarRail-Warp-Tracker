import { SettingKey } from '@/main/db/models/SettingKey'
import { IpcSettingAction } from '@/main/ipc/setting/IpcSettingAction'
import { onMounted, ref } from 'vue'

export function useSetting(key: SettingKey) {
    const setting = ref<string | null>(null)
    let hasLoadedInitValue = false

    onMounted(async() => {
        const res = await window.api[IpcSettingAction.GET_SETTING](key)
        if (!res.success) {
            console.warn(res.message)
            console.warn(res.stack)
            return
        }

        setting.value = res.data ?? null
        hasLoadedInitValue = true
    })

    const save = async() => {
        if (!hasLoadedInitValue) {
            return
        }
        if (!setting.value) {
            return
        }

        await window.api[IpcSettingAction.UPDATE_SETTING](key, setting.value)
    }

    return {
        setting,
        save,
    }
}
