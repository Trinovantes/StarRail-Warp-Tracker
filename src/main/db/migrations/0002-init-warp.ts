import { sql } from 'drizzle-orm'
import { Migration } from '../Migration'

const migration: Migration = {
    version: '0002' as const,

    run: (transaction) => {
        transaction.run(sql`
            CREATE TABLE 'Warp' (
                'id'            TEXT        PRIMARY KEY             ,
                'uid'           TEXT        NOT NULL                ,

                'bannerId'      TEXT        NOT NULL                ,
                'bannerType'    TEXT        NOT NULL                ,

                'itemId'        TEXT        NOT NULL                ,
                'itemType'      TEXT        NOT NULL                ,
                'itemName'      TEXT        NOT NULL                ,
                'rarity'        INTEGER     NOT NULL                ,

                'pulledAt'      TEXT        NOT NULL
            ) STRICT
        `)
    },
}

export default migration
