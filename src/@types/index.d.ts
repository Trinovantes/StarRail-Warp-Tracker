import type { IpcRendererEvent } from 'electron'
import type { IpcEventMap, IpcHandlers } from '@/main/ipc'
import type { IpcActionResult } from '@/main/ipc/registerIpcActionHandlers'

type OmitFirstArg<Fn> = Fn extends (x: never, ...args: infer RestOfParams) => infer RetType
    ? (...args: RestOfParams) => RetType
    : never

type AddEventArg<Fn> = Fn extends (...args: infer Params) => infer RetType
    ? (event: IpcRendererEvent, ...args: Params) => RetType
    : never

declare global {
    const DEFINE: Readonly<{
        IS_DEV: boolean
        GIT_HASH: string
        DEV_SERVER_PORT: number
        APP_VERSION: string
        APP_SLUG: string
        APP_PRODUCT_NAME: string
        APP_HOMEPAGE: string
    }>

    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Window {
        api: {
            [K in keyof IpcHandlers]: (...args: Parameters<OmitFirstArg<IpcHandlers[K]>>) => Promise<
                IpcActionResult<
                    Awaited<ReturnType<IpcHandlers[K]>>
                >
            >
        }

        syncApi: {
            [K in keyof IpcHandlers]: (...args: Parameters<OmitFirstArg<IpcHandlers[K]>>) => Awaited<
                IpcActionResult<
                    Awaited<ReturnType<IpcHandlers[K]>>
                >
            >
        }

        onEvent: {
            [K in keyof IpcEventMap]: (listener: AddEventArg<IpcEventMap[K]>) => void
        }

        offEvent: {
            [K in keyof IpcEventMap]: (listener: AddEventArg<IpcEventMap[K]>) => void
        }
    }
}

export {}
