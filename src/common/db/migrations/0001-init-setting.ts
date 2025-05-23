import { sql } from 'drizzle-orm'
import { Migration } from '../migrateDb'

const migration: Migration = {
    version: '0001' as const,

    run: (transaction) => {
        transaction.run(sql`
            CREATE TABLE 'Setting' (
                'key'           TEXT        PRIMARY KEY             ,
                'value'         TEXT        NOT NULL
            ) STRICT
        `)

        transaction.run(sql`INSERT INTO Setting (key, value) VALUES ('GAME_INSTALL_DIR', 'C:/Program Files/Star Rail/')`)
    },
}

export default migration
