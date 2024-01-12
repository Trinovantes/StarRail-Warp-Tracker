import 'source-map-support/register'
import { setupErrorHandlers } from './setup/setupErrorHandlers'
import { setupIpc } from './setup/setupIpc'
import { setupWindow } from './setup/setupWindow'
import log from 'electron-log'
import path from 'upath'

const mainLogger = log.scope('main')
const rendererLogger = log.scope('renderer')

async function main() {
    mainLogger.info('Starting Main Process')
    mainLogger.info(`Log saved to "${path.resolve(log.transports.file.getFile().path)}"`)

    await setupIpc(mainLogger, rendererLogger)
    setupWindow(mainLogger)
    setupErrorHandlers(mainLogger)
}

main().catch((err) => {
    mainLogger.error(err)
    process.exit(1)
})
