import { MAX_MIGRATION_ATTEMPTS } from '@/common/Constants'
import { sleep } from '@/common/utils/sleep'
import { createMigrationTable, insertMigration, getCurrentMigrationVersion, Migration } from './Migration'
import { DrizzleClient } from '@/main/db/createDb'
import { LogFunctions } from 'electron-log'
import { DrizzleError } from 'drizzle-orm'

export async function migrateDb(db: DrizzleClient, migrations: Array<Migration>, logger?: LogFunctions) {
    for (let attempt = 1; attempt <= MAX_MIGRATION_ATTEMPTS; attempt++) {
        try {
            await migrate(db, migrations, attempt, logger)
            return
        } catch (err) {
            if (attempt === MAX_MIGRATION_ATTEMPTS) {
                logger?.error('Failed to migrate db')
                logger?.error(err)

                if (err instanceof DrizzleError) {
                    logger?.error(err.cause)
                }

                process.exit(1)
            }

            const duration = Math.round(Math.floor(Math.random() * 1000) + (Math.exp(attempt) * 1000))
            logger?.warn(`Failed migration, going to sleep for ${duration}ms`)
            logger?.warn(err)
            await sleep(duration)
        }
    }
}

async function migrate(db: DrizzleClient, migrations: Array<Migration>, attempt: number, logger?: LogFunctions) {
    await db.transaction(async(tx) => {
        createMigrationTable(tx)

        const currentVersion = getCurrentMigrationVersion(db)
        const migrationsToRun = currentVersion
            ? migrations.filter((migration) => migration.version > currentVersion)
            : migrations

        logger?.info(`migrateDb() attempt:${attempt} currentVersion:${currentVersion} migrationsToRun:${migrationsToRun.length}`)
        for (const migration of migrationsToRun) {
            logger?.info('Starting Migration', migration.version)

            await migration.run(tx)
            insertMigration(db, migration.version)

            logger?.info(`Completed Migration ${migration.version}`)
        }
    })
}
