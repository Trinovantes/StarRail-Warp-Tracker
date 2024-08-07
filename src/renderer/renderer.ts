import './client/assets/css/main.scss'
import { createPinia } from 'pinia'
import { Notify, Quasar, Loading } from 'quasar'
import { createApp } from 'vue'
import App from './client/App.vue'
import { createVueRouter } from './client/router/createVueRouter'
import { DebugIpcEvent } from '@/main/ipc/Debug/DebugIpcEvent'
import { logError } from './client/utils/log'
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
        },
        config: {
            dark: true,
        },
    })

    app.mount('#app')
}

window.onEvent[DebugIpcEvent.EXCEPTION]((event, errorName, callStack) => {
    console.error(errorName, callStack)
})

window.addEventListener('error', (event) => {
    console.error(event.error)
    if (event.error instanceof Error) {
        logError(event.error)
    }
})

window.addEventListener('unhandledrejection', (event) => {
    console.error(event.reason)
    if (event.reason instanceof Error) {
        logError(event.reason)
    }
})

void main()
