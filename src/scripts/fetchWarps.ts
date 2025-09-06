import { DB_MEMORY } from '../common/Constants.ts'
import { createDb } from '../common/db/createDb.ts'
import { getMigrations } from '../common/db/getMigrations.ts'
import { GACHA_BANNER_TYPE_LIMITED_CHARACTER } from '../common/StarRail.ts'
import { fetchWarpHistory } from '../main/ipc/WarpTracker/fetchWarpHistory.ts'

const migrations = await getMigrations()
const db = await createDb(DB_MEMORY, {
    logger: console,
    cleanOnExit: true,
    migrations,
})

await fetchWarpHistory(db, GACHA_BANNER_TYPE_LIMITED_CHARACTER)
