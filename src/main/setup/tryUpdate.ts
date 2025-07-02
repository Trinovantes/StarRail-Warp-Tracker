import { DbLogger } from '@/common/db/createDb'
import { autoUpdater } from 'electron-updater'

export async function tryUpdate(logger: DbLogger) {
    try {
        autoUpdater.logger = logger
        await autoUpdater.checkForUpdatesAndNotify()
    } catch (err) {
        logger.warn(err)
    }
}
