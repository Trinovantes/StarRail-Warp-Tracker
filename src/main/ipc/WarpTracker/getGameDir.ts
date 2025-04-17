import { DEFAULT_GAME_DIR } from '@/common/Constants'
import appDirs from 'appdirsjs'
import { LogFunctions } from 'electron-log'
import { existsSync, statSync, createReadStream } from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'

export async function getGameDir(isWsl: boolean, logger?: LogFunctions): Promise<string> {
    const appDataDir = appDirs({ appName: DEFINE.APP_PRODUCT_NAME }).config
    const logDirs = [
        '../../LocalLow/Cognosphere/Star Rail', // Global
        '../../LocalLow/miHoYo/崩坏：星穹铁道', // CN
    ]
    const logFileNames = [
        'Player.log',
        'Player-prev.log',
    ]

    for (const logDir of logDirs) {
        for (const logFileName of logFileNames) {
            const logFilePath = path.join(appDataDir, logDir, logFileName)
            if (existsSync(logFilePath) && isFileNonEmpty(logFilePath)) {
                return await parsePlayerLog(logFilePath)
            }
        }
    }

    logger?.warn('Failed to find player log file')
    return DEFAULT_GAME_DIR
}

async function parsePlayerLog(filePath: string, logger?: LogFunctions): Promise<string> {
    const fileStream = createReadStream(filePath, { encoding: 'utf-8' })
    const readInterface = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    })

    for await (const line of readInterface) {
        const gameDir = /Loading player data from (?<gameDir>.+)\/data\.unity3d$/.exec(line)?.groups?.gameDir
        if (gameDir) {
            return gameDir
        }
    }

    logger?.warn(`Failed to find gameDir in log file "${filePath}"`)
    return DEFAULT_GAME_DIR
}

function isFileNonEmpty(filePath: string): boolean {
    try {
        const stats = statSync(filePath)
        return stats.size > 0
    } catch (_err) {
        return false
    }
}
