import type { IpcRendererEvent } from 'electron'
import type { IpcActionResult } from '../main/ipc/registerIpcActionHandlers.ts'
import type { IpcEventMap, IpcHandlers } from '../main/ipc/index.ts'

type OmitFirstArg<Fn> = Fn extends (x: never, ...args: infer RestOfParams) => infer RetType
    ? (...args: RestOfParams) => RetType
    : never

type AddEventArg<Fn> = Fn extends (...args: infer Params) => infer RetType
    ? (event: IpcRendererEvent, ...args: Params) => RetType
    : never

declare global {
    const __IS_DEV__: boolean
    const __GIT_HASH__: string
    const __DEV_SERVER_PORT__: number
    const __APP_VERSION__: string
    const __APP_SLUG__: string
    const __APP_PRODUCT_NAME__: string
    const __APP_HOMEPAGE__: string

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
