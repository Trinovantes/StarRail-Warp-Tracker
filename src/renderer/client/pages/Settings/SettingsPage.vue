<script lang="ts" setup>
import { SettingKey } from '@/main/db/models/SettingKey'
import { useSetting } from './useSetting'
import { useQuasar } from 'quasar'
import { SettingIpcAction } from '@/main/ipc/Setting/SettingIpcAction'
import { DEFAULT_GAME_INSTALL_DIR } from '@/common/Constants'

const gameDir = useSetting(SettingKey.GAME_INSTALL_DIR)
const openGameDirPicker = async() => {
    const res = await window.api[SettingIpcAction.SHOW_OPEN_DIALOG]({
        title: 'Select game installation directory',
        defaultPath: DEFAULT_GAME_INSTALL_DIR,
        properties: ['openDirectory'],
    })

    if (!res.success) {
        return
    }
    if (res.data.canceled) {
        return
    }

    gameDir.setting.value = res.data.filePaths[0]
}

const $q = useQuasar()
const onSubmit = async() => {
    await gameDir.save()

    $q.notify({
        message: 'Saved Settings',
        type: 'positive',
        position: 'bottom',
    })
}
</script>

<template>
    <article>
        <h1>
            Settings
        </h1>

        <section>
            <q-form
                @submit="onSubmit"
            >
                <div class="flex">
                    <q-input
                        v-model="gameDir.setting.value"
                        label="Game Installation Directory"
                        hint="This folder should contain launcher.exe"
                        class="flex-1"
                        disable
                        filled
                        square
                        lazy-rules
                        hide-bottom-space
                        :rules="[ val => Boolean(val) && val.length > 0 || 'Missing install directory']"
                    />

                    <q-btn
                        icon="search"
                        label="Change Folder"
                        unelevated
                        color="info"
                        @click="openGameDirPicker"
                    />
                </div>

                <div>
                    <q-btn
                        type="submit"
                        label="Save"
                        color="positive"
                        unelevated
                    />
                </div>
            </q-form>
        </section>
    </article>
</template>

<style lang="scss" scoped>
form{
    display: grid;
    gap: $padding * 2;

    > .flex{
        align-items: start;
        gap: $padding;
    }
}
</style>
