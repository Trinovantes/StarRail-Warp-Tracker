import 'source-map-support/register'
import log from 'electron-log'
import path from 'node:path'
import { app } from 'electron'
import cfg from 'electron-cfg'
import { DB_FILE, DB_MEMORY } from '../common/Constants.ts'
import { createDb } from '../common/db/createDb.ts'
import { getMigrations } from '../common/db/getMigrations.ts'
import { createDebugIpcActionHandlers } from './ipc/Debug/DebugIpcActionHandlers.ts'
import { registerIpcActionHandlers, type IpcActionHandler } from './ipc/registerIpcActionHandlers.ts'
import { createSettingIpcActionHandlers } from './ipc/Setting/SettingIpcActionHandlers.ts'
import { createWarpTrackerIpcActionHandlers } from './ipc/WarpTracker/WarpTrackerIpcActionHandlers.ts'
import { createWindowIpcActionHandlers } from './ipc/Window/WindowIpcActionHandlers.ts'
import { setupErrorHandlers } from './setup/setupErrorHandlers.ts'
import { tryUpdate } from './setup/tryUpdate.ts'
import { setupWindow } from './setup/setupWindow.ts'

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
    const dbFilePath = __IS_DEV__ ? DB_MEMORY : cfg.get('DATABASE_FILE_PATH', defaultDbFilePath) as string
    mainLogger.info(`Database saved to "${dbFilePath}"`)

    const migrations = await getMigrations()
    const db = await createDb(dbFilePath, {
        cleanOnExit: true,
        migrations,
        logger: dbLogger,
    })

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
