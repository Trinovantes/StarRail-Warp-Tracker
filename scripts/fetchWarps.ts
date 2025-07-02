import { DB_MEMORY } from '@/common/Constants'
import { createDb } from '@/common/db/createDb'
import { getMigrations } from '@/common/db/getMigrations'
import { GACHA_BANNER_TYPE_LIMITED_CHARACTER } from '@/common/StarRail'
import { fetchWarpHistory } from '@/main/ipc/WarpTracker/fetchWarpHistory'

const migrations = await getMigrations()
const db = await createDb(DB_MEMORY, {
    cleanOnExit: true,
    migrations,
})

await fetchWarpHistory(db, GACHA_BANNER_TYPE_LIMITED_CHARACTER)
