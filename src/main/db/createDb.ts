import BetterSqlite3 from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { warpTable } from './models/Warp'
import { settingTable } from './models/Setting'
import { LogFunctions } from 'electron-log'
import { DB_FILE, DB_MEMORY } from '@/common/Constants'
import path from 'upath'
import { app } from 'electron'

export type DrizzleClient = ReturnType<typeof createDb>['db']
export type DrizzleTransaction = Parameters<Parameters<DrizzleClient['transaction']>[0]>[0]

export function createDb(filePath: string, cleanOnExit: boolean, logger?: LogFunctions) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nativeBinding = require('better-sqlite3/build/Release/better_sqlite3.node') as string
    logger?.info(`Loaded DB bindings (${Boolean(nativeBinding)})`)

    const dbFilePath = filePath === DB_MEMORY ? DB_MEMORY : path.resolve(app.getPath('userData'), DB_FILE)
    logger?.info(`Initializing DB from "${dbFilePath}"`)

    const client = new BetterSqlite3(dbFilePath, {
        nativeBinding,
        verbose: logger
            ? (message: unknown, ...additionalArgs: Array<unknown>) => {
                if (typeof message === 'string') {
                    message = message.replace(/^\n+/g, '\n').trimEnd()
                }

                logger?.debug(message)

                if (additionalArgs.length > 0) {
                    logger?.debug(additionalArgs)
                }
            }
            : undefined,
    })

    client.pragma('foreign_keys = ON')
    client.pragma('journal_mode = WAL')
    client.pragma('analysis_limit = 1000')

    // Catch CTRL+C events and close client properly
    if (cleanOnExit) {
        process.on('exit', () => {
            client.pragma('optimize')
            client.close()
        })
        process.on('SIGHUP', () => process.exit(128 + 1))
        process.on('SIGINT', () => process.exit(128 + 2))
        process.on('SIGTERM', () => process.exit(128 + 15))
    }

    const db = drizzle(client, {
        schema: {
            settingTable,
            warpTable,
        },
    })

    return {
        db,
        client,
    }
}
