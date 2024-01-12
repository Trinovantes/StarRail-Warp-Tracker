import { LogFunctions } from 'electron-log'
import { autoUpdater } from 'electron-updater'

export async function tryUpdate(logger: LogFunctions) {
    try {
        autoUpdater.logger = logger
        await autoUpdater.checkForUpdatesAndNotify()
    } catch (err) {
        logger.warn(err)
    }
}
