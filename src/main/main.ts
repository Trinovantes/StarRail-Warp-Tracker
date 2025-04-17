import 'source-map-support/register'
import log from 'electron-log'
import { setupWindow } from './setup/setupWindow'
import { tryUpdate } from './setup/tryUpdate'
import { setupErrorHandlers } from './setup/setupErrorHandlers'
import path from 'node:path'
import { app } from 'electron'
import { DB_FILE, DB_MEMORY } from '@/common/Constants'
import { createDb } from './db/createDb'
import { getMigrations } from './db/getMigrations'
import { migrateDb } from './db/migrateDb'
import cfg from 'electron-cfg'
import { IpcActionHandler, registerIpcActionHandlers } from './ipc/registerIpcActionHandlers'
import { createDebugIpcActionHandlers } from './ipc/Debug/DebugIpcActionHandlers'
import { createSettingIpcActionHandlers } from './ipc/Setting/SettingIpcActionHandlers'
import { createWindowIpcActionHandlers } from './ipc/Window/WindowIpcActionHandlers'
import { createWarpTrackerIpcActionHandlers } from './ipc/WarpTracker/WarpTrackerIpcActionHandlers'

async function main() {
    // ------------------------------------------------------------------------
    // Configure logs
    // ------------------------------------------------------------------------

    log.transports.file.level = 'debug'

    const mainLogger = log.scope('main')
    const dbLogger = log.scope('db')
    const rendererLogger = log.scope('renderer')

    mainLogger.info('Starting Main Process')
    mainLogger.info(`Log saved to "${log.transports.file.getFile().path}"`)

    // ------------------------------------------------------------------------
    // Set up database
    // ------------------------------------------------------------------------

    const defaultDbFilePath = path.resolve(app.getPath('userData'), DB_FILE)
    const dbFilePath = DEFINE.IS_DEV ? DB_MEMORY : cfg.get('DATABASE_FILE_PATH', defaultDbFilePath) as string
    mainLogger.info(`Database saved to "${dbFilePath}"`)

    const { db } = createDb(dbFilePath, true, mainLogger, dbLogger)
    const migrations = getMigrations()
    await migrateDb(db, migrations, mainLogger)

    // ------------------------------------------------------------------------
    // Register ipc handlers
    // ------------------------------------------------------------------------

    registerIpcActionHandlers(createDebugIpcActionHandlers(rendererLogger) as Record<string, IpcActionHandler>)
    registerIpcActionHandlers(createSettingIpcActionHandlers(db) as Record<string, IpcActionHandler>)
    registerIpcActionHandlers(createWarpTrackerIpcActionHandlers(mainLogger, db) as Record<string, IpcActionHandler>)
    registerIpcActionHandlers(createWindowIpcActionHandlers() as Record<string, IpcActionHandler>)

    // ------------------------------------------------------------------------
    // Init app
    // ------------------------------------------------------------------------

    setupWindow(mainLogger)
    setupErrorHandlers()
    await tryUpdate(mainLogger)
}

void main()
