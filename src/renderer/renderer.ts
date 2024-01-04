import './client/assets/css/main.scss'
import { createPinia } from 'pinia'
import { Quasar, Notify, Loading, Dialog } from 'quasar'
import { createApp } from 'vue'
import App from './client/App.vue'
import { createVueRouter } from './client/router/createVueRouter'
import { notifyError } from './client/utils/notifyError'
import { IpcDebugEvent } from '@/main/ipc/debug/IpcDebugEvent'
import { useTrackerStore } from './client/store/Tracker/useTrackerStore'

async function main() {
    console.info('Release', DEFINE.GIT_HASH)

    // Vue
    const app = createApp(App)

    // Pinia
    const pinia = createPinia()
    app.use(pinia)

    const trackerStore = useTrackerStore()
    await trackerStore.init()

    // Vue Router
    const router = createVueRouter()
    app.use(router)
    await router.isReady()

    // Quasar
    app.use(Quasar, {
        plugins: {
            Notify,
            Loading,
            Dialog,
        },
        config: {
            dark: true,
        },
    })

    app.mount('#app')
}

window.onEvent[IpcDebugEvent.EXCEPTION]((event, errorName, callStack) => {
    console.warn(errorName, callStack)
    notifyError(errorName, callStack)
})

window.addEventListener('error', (event) => {
    console.warn(event.error)
    if (event.error instanceof Error) {
        notifyError(event.error.name, event.error.stack)
    }
})

window.addEventListener('unhandledrejection', (event) => {
    console.warn(event.reason)
    if (event.reason instanceof Error) {
        notifyError(event.reason.name, event.reason.stack)
    }
})

main().catch((err) => {
    console.warn(err)
    if (err instanceof Error) {
        notifyError(err.name, err.stack)
    }
})
