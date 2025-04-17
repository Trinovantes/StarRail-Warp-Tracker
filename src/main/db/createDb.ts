import BetterSqlite3 from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { warpTable } from './models/Warp'
import { settingTable } from './models/Setting'
import { LogFunctions } from 'electron-log'

type DrizzleDb = ReturnType<typeof createDb>['db']
export type DrizzleTransaction = Parameters<Parameters<DrizzleDb['transaction']>[0]>[0]
export type DrizzleClient = DrizzleDb | DrizzleTransaction

export function createDb(dbFilePath: string, cleanOnExit: boolean, mainLogger?: LogFunctions, dbLogger?: LogFunctions) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nativeBinding = require('better-sqlite3/build/Release/better_sqlite3.node') as string
    mainLogger?.info(`Loaded DB bindings (${Boolean(nativeBinding)})`)

    const client = new BetterSqlite3(dbFilePath, {
        nativeBinding,
        verbose: dbLogger
            ? (message: unknown, ...additionalArgs: Array<unknown>) => {
                if (typeof message === 'string') {
                    message = message.replace(/^\n+/g, '\n').trimEnd()
                }

                dbLogger?.debug(message)

                if (additionalArgs.length > 0) {
                    dbLogger?.debug(additionalArgs)
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
