import { LogFunctions } from 'electron-log'
import { autoUpdater } from 'electron-updater'

export async function tryUpdate(logger: LogFunctions) {
    try {
        autoUpdater.logger = logger
        const updateResult = await autoUpdater.checkForUpdatesAndNotify()
        logger.info(updateResult)
    } catch (err) {
        logger.warn(err)
    }
}
