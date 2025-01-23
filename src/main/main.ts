import 'source-map-support/register'
import log from 'electron-log'
import { setupWindow } from './setup/setupWindow'
import { DebugModule } from './ipc/Debug/DebugModule'
import { SettingModule } from './ipc/Setting/SettingModule'
import { WarpTrackerModule } from './ipc/WarpTracker/WarpTrackerModule'
import { WindowModule } from './ipc/Window/WindowModule'
import { tryUpdate } from './setup/tryUpdate'
import { setupErrorHandlers } from './setup/setupErrorHandlers'
import path from 'node:path'
import { app } from 'electron'
import { DB_FILE } from '@/common/Constants'
import { createDb } from './db/createDb'
import { getMigrations } from './db/getMigrations'
import { migrateDb } from './db/migrateDb'
import cfg from 'electron-cfg'

async function main() {
    // ------------------------------------------------------------------------
    // Configure logs
    // ------------------------------------------------------------------------

    log.transports.file.level = 'debug'

    const mainLogger = log.scope('main')
    const rendererLogger = log.scope('renderer')

    mainLogger.info('Starting Main Process')
    mainLogger.info(`Log saved to "${log.transports.file.getFile().path}"`)

    // ------------------------------------------------------------------------
    // Set up database
    // ------------------------------------------------------------------------

    const defaultDbFilePath = path.resolve(app.getPath('userData'), DB_FILE)
    const dbFilePath = cfg.get('DATABASE_FILE_PATH', defaultDbFilePath) as string
    mainLogger.info(`Database saved to "${dbFilePath}"`)

    const { db } = createDb(dbFilePath, true, mainLogger)
    const migrations = getMigrations()
    await migrateDb(db, migrations, mainLogger)

    // ------------------------------------------------------------------------
    // Register ipc handlers
    // ------------------------------------------------------------------------

    const ipcHandlerModules = [
        new DebugModule(mainLogger, rendererLogger),
        new WindowModule(mainLogger),
        new SettingModule(mainLogger, db),
        new WarpTrackerModule(mainLogger, db),
    ]

    for (const module of ipcHandlerModules) {
        module.init()
    }

    // ------------------------------------------------------------------------
    // Init app
    // ------------------------------------------------------------------------

    setupWindow(mainLogger)
    setupErrorHandlers()
    await tryUpdate(mainLogger)
}

void main()
