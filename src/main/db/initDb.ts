import { createDb } from './createDb'
import { DB_FILE } from '@/common/Constants'
import { migrateDb } from './migrateDb'
import { getMigrations } from './getMigrations'
import { LogFunctions } from 'electron-log'

export async function initDb(logger?: LogFunctions) {
    const { db } = createDb(DB_FILE, true, logger)
    const migrations = getMigrations()
    await migrateDb(db, migrations, logger)
    return db
}
