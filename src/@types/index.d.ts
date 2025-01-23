import { IpcRendererEvent } from 'electron'
import { IpcEventMap, IpcActionHandlers } from '@/main/ipc'
import { IpcActionResult } from '@/main/ipc/IpcActionModule'

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
            [K in keyof IpcActionHandlers]: (...args: Parameters<OmitFirstArg<IpcActionHandlers[K]>>) => Promise<
                IpcActionResult<
                    Awaited<ReturnType<IpcActionHandlers[K]>>
                >
            >
        }

        syncApi: {
            [K in keyof IpcActionHandlers]: (...args: Parameters<OmitFirstArg<IpcActionHandlers[K]>>) => Awaited<
                IpcActionResult<
                    Awaited<ReturnType<IpcActionHandlers[K]>>
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
