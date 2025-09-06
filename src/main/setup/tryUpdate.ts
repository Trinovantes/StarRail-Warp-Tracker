import { autoUpdater } from 'electron-updater'
import type { DbLogger } from '../../common/db/createDb.ts'

export async function tryUpdate(logger: DbLogger) {
    try {
        autoUpdater.logger = logger
        await autoUpdater.checkForUpdatesAndNotify()
    } catch (err) {
        logger.warn(err)
    }
}
