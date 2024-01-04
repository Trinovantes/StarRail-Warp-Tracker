import { ipcMain } from 'electron'

type IpcHandler = Parameters<typeof ipcMain.handle>[1]
type RuntimeEnum = Record<string, string>
export type ActionHandler<E extends RuntimeEnum> = Record<E[keyof E], IpcHandler>
