import { DB_MEMORY } from '@/common/Constants'
import { createDb, DrizzleClient } from '@/common/db/createDb'
import { getMigrations } from '@/common/db/getMigrations'
import { migrateDb } from '@/common/db/migrateDb'
import { test } from 'vitest'

type SqliteTableColumn = {
    cid: number
    name: string
    type: string
    notnull: 0 | 1
    pk: 0 | 1
}

export type DbFixtures = {
    db: DrizzleClient
    migrateToVersion: (version: number) => Promise<void>
    getTableColumns: (tableName: string) => Array<SqliteTableColumn>
}

export const dbTest = test.extend<DbFixtures>({
    db: async({}, use) => {
        const db = await createDb(DB_MEMORY)
        await use(db)
    },

    migrateToVersion: async({ db }, use) => {
        const migrations = await getMigrations()
        const migrateToVersion = async(version: number) => {
            await migrateDb(db, migrations.filter((migration) => parseInt(migration.version) <= version))
        }

        await use(migrateToVersion)
    },

    getTableColumns: async({ db }, use) => {
        const getTableColumns = (tableName: string) => {
            return db.all<SqliteTableColumn>(`PRAGMA table_info('${tableName}')`)
        }

        await use(getTableColumns)
    },
})
