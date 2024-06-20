import 'source-map-support/register'
import log from 'electron-log'
import { setupWindow } from './setup/setupWindow'
import { initDb } from './db/initDb'
import { DebugModule } from './ipc/Debug/DebugModule'
import { SettingModule } from './ipc/Setting/SettingModule'
import { WarpTrackerModule } from './ipc/WarpTracker/WarpTrackerModule'
import { WindowModule } from './ipc/Window/WindowModule'
import { tryUpdate } from './setup/tryUpdate'
import { setupErrorHandlers } from './setup/setupErrorHandlers'

log.transports.file.level = 'debug'
const mainLogger = log.scope('main')
const rendererLogger = log.scope('renderer')

mainLogger.info('Starting Main Process')
mainLogger.info(`Log saved to "${log.transports.file.getFile().path}"`)

async function main() {
    const db = await initDb()

    const ipcHandlerModules = [
        new DebugModule(mainLogger, rendererLogger),
        new WindowModule(mainLogger),
        new SettingModule(mainLogger, db),
        new WarpTrackerModule(mainLogger, db),
    ]

    for (const module of ipcHandlerModules) {
        module.init()
    }

    setupWindow(mainLogger)
    setupErrorHandlers()
    await tryUpdate(mainLogger)
}

void main()
