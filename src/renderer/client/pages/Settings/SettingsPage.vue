<script lang="ts" setup>
import { DEFAULT_GAME_DIR } from '../../../../common/Constants.ts'
import { SETTING_IPC_ACTION } from '../../../../main/ipc/Setting/SettingIpcAction.ts'
import { useSetting } from './useSetting.ts'
import { useQuasar } from 'quasar'

const gameDir = useSetting('GAME_INSTALL_DIR')
const openGameDirPicker = async () => {
    const res = await window.api[SETTING_IPC_ACTION.SHOW_OPEN_DIALOG]({
        title: 'Select game data directory',
        defaultPath: DEFAULT_GAME_DIR,
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
const onSubmit = async () => {
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
                        label="Game Data Directory"
                        hint="This directory should contain a 'webCaches' folder"
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
