import { test } from 'vitest'
import { DB_MEMORY } from '../../../src/common/Constants.ts'
import { type DbLogger, type DrizzleClient, createDb } from '../../../src/common/db/createDb.ts'
import { getMigrations } from '../../../src/common/db/getMigrations.ts'
import { migrateDb } from '../../../src/common/db/migrateDb.ts'

type SqliteTableColumn = {
    cid: number
    name: string
    type: string
    notnull: 0 | 1
    pk: 0 | 1
}

export type DbFixtures = {
    logger?: DbLogger
    db: DrizzleClient
    migrateToVersion: (version: number) => Promise<void>
    getTableColumns: (tableName: string) => Array<SqliteTableColumn>
}

export const dbTest = test.extend<DbFixtures>({
    logger: async ({}, use) => {
        await use(undefined)
    },

    db: async ({ logger }, use) => {
        const db = await createDb(DB_MEMORY, { logger })
        await use(db)
    },

    migrateToVersion: async ({ db, logger }, use) => {
        const migrations = await getMigrations()
        const migrateToVersion = async (version: number) => {
            await migrateDb(db, migrations.filter((migration) => parseInt(migration.version) <= version), { logger })
        }

        await use(migrateToVersion)
    },

    getTableColumns: async ({ db }, use) => {
        const getTableColumns = (tableName: string) => {
            return db.all<SqliteTableColumn>(`PRAGMA table_info('${tableName}')`)
        }

        await use(getTableColumns)
    },
})
