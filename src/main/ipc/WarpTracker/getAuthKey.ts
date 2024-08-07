import { readFileSync } from 'node:fs'
import { getCacheFilePath } from './getCacheFilePath'
import { LogFunctions } from 'electron-log'

const gachaLogRe = /https:\/\/.+\.(mihoyo|hoyoverse)\.com\/common\/gacha_record\/api\/getGachaLog[^\0]*/g

export function getAuthKey(gameDir: string, isWsl: boolean, logger?: LogFunctions): string {
    const cacheFile = getCacheFilePath(gameDir, isWsl)
    const contents = readFileSync(cacheFile).toString('utf-8')

    let gachaLogUrl: string | null = null
    for (const match of contents.matchAll(gachaLogRe)) {
        gachaLogUrl = match[0] // Save last url as that's the most recent
    }

    if (!gachaLogUrl) {
        const errMsg = 'Failed to find authKey in cacheFile (did you open Warp Records in-game?)'
        logger?.warn(errMsg)
        throw new Error(errMsg)
    }

    const url = new URL(gachaLogUrl)
    const authKey = url.searchParams.get('authkey')
    if (!authKey) {
        const errMsg = `Failed to parse authKey from url "${url.toString()}"`
        logger?.warn(errMsg)
        throw new Error(errMsg)
    }

    logger?.info('Found authKey', `len:${authKey.length}`)
    return authKey
}
