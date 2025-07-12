import { readFileSync } from 'node:fs'
import { getCacheFilePath } from './getCacheFilePath'
import { MissingAuthKeyError } from '@/common/node/ExpectedError'
import { DbLogger } from '@/common/db/createDb'

const gachaLogRe = /https:\/\/.+\.(mihoyo|hoyoverse)\.com\/common\/gacha_record\/api\/(getGachaLog|getLdGachaLog)[^\0]*/g

export function getAuthKey(gameDir: string, isWsl: boolean, logger?: DbLogger): string {
    const cacheFile = getCacheFilePath(gameDir, isWsl)
    const contents = readFileSync(cacheFile).toString('utf-8')

    let gachaLogUrl: string | null = null
    for (const match of contents.matchAll(gachaLogRe)) {
        gachaLogUrl = match[0] // Save last url as that's the most recent
    }

    if (!gachaLogUrl) {
        logger?.warn('Failed to find authKey in cacheFile')
        throw new MissingAuthKeyError()
    }

    const url = new URL(gachaLogUrl)
    const authKey = url.searchParams.get('authkey')
    if (!authKey) {
        logger?.warn(`Failed to parse authKey from url "${url.toString()}"`)
        throw new MissingAuthKeyError()
    }

    logger?.info('Found authKey', `len:${authKey.length}`)
    return authKey
}
