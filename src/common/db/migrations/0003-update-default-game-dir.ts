import { sql } from 'drizzle-orm'
import { Migration } from '../migrateDb'
import { getGameDir } from '@/main/ipc/WarpTracker/getGameDir'

const migration: Migration = {
    version: '0003' as const,

    run: async(transaction) => {
        const isWsl = Boolean(process.env.WSL_DISTRO_NAME)
        const gameDir = await getGameDir(isWsl)

        transaction.run(sql`
            UPDATE 'Setting'
            SET
                value = ${gameDir}
            WHERE
                key = 'GAME_INSTALL_DIR'
        `)
    },
}

export default migration
