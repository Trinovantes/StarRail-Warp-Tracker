import { existsSync, readdirSync } from 'node:fs'
import path from 'upath'
import type { DbLogger } from '../../../common/db/createDb.ts'

export function getCacheFilePath(gameDir: string, isWsl: boolean, logger?: DbLogger): string {
    // Change to posix paths (node can accept posix path on windows)
    gameDir = path.normalizeSafe(gameDir)

    // Convert drive path if we are inside WSL (assume drives are always mounted)
    if (isWsl) {
        const matches = /^([A-Za-z]):(\/.*)$/.exec(gameDir)
        if (matches) {
            const drive = matches[1].toLowerCase()
            const dirPath = matches[2]
            gameDir = drive + dirPath
        }

        gameDir = '/mnt/' + gameDir
    }

    const webCachesDir = path.join(gameDir, 'webCaches')
    if (!existsSync(webCachesDir)) {
        const errMsg = `Failed to resolve webCaches dir "${webCachesDir}"`
        logger?.warn(errMsg)
        throw new Error(errMsg)
    }

    const versionCaches = readdirSync(webCachesDir, { withFileTypes: true })
        .filter((item) => item.isDirectory())
        .map((item) => item.name)
        .sort()

    if (versionCaches.length === 0) {
        const errMsg = 'No cache found inside webCaches dir'
        logger?.warn(errMsg)
        throw new Error(errMsg)
    }

    const latestVersion = versionCaches.at(-1) ?? ''
    if (!/\d+\.\d+\.\d+\.\d+/.test(latestVersion)) {
        const errMsg = `Invalid version "${latestVersion}"`
        logger?.warn(errMsg)
        throw new Error(errMsg)
    }

    const cacheFile = path.join(webCachesDir, latestVersion, 'Cache', 'Cache_Data', 'data_2')
    if (!existsSync(cacheFile)) {
        const errMsg = `Cache file "${cacheFile}" does not exist`
        logger?.warn(errMsg)
        throw new Error(errMsg)
    }

    return cacheFile
}
