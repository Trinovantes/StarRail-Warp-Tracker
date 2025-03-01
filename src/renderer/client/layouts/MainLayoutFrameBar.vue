<script lang="ts" setup>
import { WINDOW_IPC_ACTION } from '@/main/ipc/Window/WindowIpcAction'
import { APP_NAME, BUILD_INFO } from '@/common/Constants'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const maximizeIcon = ref('')
const updateMaximizeIcon = () => {
    void window.api[WINDOW_IPC_ACTION.IS_MAXIMIZED]().then((res) => {
        if (!res.success) {
            return
        }

        const isMaximized = res.data
        if (isMaximized) {
            maximizeIcon.value = 'ms-Icon ms-Icon--ChromeRestore'
        } else {
            maximizeIcon.value = 'ms-Icon ms-Icon--Checkbox'
        }
    })
}

onMounted(() => {
    updateMaximizeIcon()
    window.addEventListener('resize', updateMaximizeIcon)
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', updateMaximizeIcon)
})

const minimize = () => {
    void window.api[WINDOW_IPC_ACTION.MINIMIZE]()
}
const maximize = () => {
    void window.api[WINDOW_IPC_ACTION.MAXIMIZE]()
}
const close = () => {
    void window.api[WINDOW_IPC_ACTION.CLOSE]()
}
</script>

<template>
    <nav
        class="frame-bar"
    >
        <router-link
            to="/"
            class="title-bar-name"
            tabindex="-1"
        >
            {{ APP_NAME }} - {{ BUILD_INFO }}
        </router-link>

        <q-space />

        <q-btn
            flat
            padding="none"
            tabindex="-1"
            @click="minimize"
        >
            <q-icon class="ms-Icon ms-Icon--ChromeMinimize" />
        </q-btn>

        <q-btn
            flat
            padding="none"
            tabindex="-1"
            @click="maximize"
        >
            <q-icon :class="maximizeIcon" />
        </q-btn>

        <q-btn
            class="close"
            flat
            padding="none"
            tabindex="-1"
            @click="close"
        >
            <q-icon class=" ms-Icon ms-Icon--ChromeClose" />
        </q-btn>
    </nav>
</template>

<style lang="scss" scoped>
nav.frame-bar{
    display: flex;
    background-color: #111;
    color: white;
    height: $frame-bar-height;

    -webkit-user-select: none;
    -webkit-app-region: drag;
    user-select: none;

    a.title-bar-name{
        color: white;
        font-size: 11px;
        font-weight: bold;
        text-transform: uppercase;
        text-decoration: none;
        line-height: $frame-bar-height;
        padding: 0 $padding;
        outline: none;
    }

    button.q-btn{
        -webkit-app-region: no-drag;

        border-radius: 0;
        padding: 0;
        width: calc($frame-bar-height * 1.5); height: $frame-bar-height;

        i.q-icon{
            font-size: 15px;
        }

        &:hover{
            background: var(--q-color-primary);
            color: white;
        }

        &.close{
            &:hover{
                background: var(--q-color-negative);
                color: white;
            }
        }
    }
}
</style>
