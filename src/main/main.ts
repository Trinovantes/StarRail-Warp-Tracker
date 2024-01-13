import 'source-map-support/register'
import { setupErrorHandlers } from './setup/setupErrorHandlers'
import { setupIpc } from './setup/setupIpc'
import { setupWindow } from './setup/setupWindow'
import { tryUpdate } from './setup/tryUpdate'
import log from 'electron-log'
import path from 'upath'
import { initDb } from './db/initDb'

log.transports.file.level = 'debug'
const mainLogger = log.scope('main')
const rendererLogger = log.scope('renderer')

async function main() {
    mainLogger.info('Starting Main Process')
    mainLogger.info(`Log saved to "${path.resolve(log.transports.file.getFile().path)}"`)

    const db = await initDb(mainLogger)
    setupIpc(db, mainLogger, rendererLogger)
    setupWindow(mainLogger)
    setupErrorHandlers(mainLogger)

    await tryUpdate(mainLogger)
}

main().catch((err) => {
    mainLogger.error(err)
    process.exit(1)
})
