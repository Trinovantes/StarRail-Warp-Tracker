import { InferInsertModel, InferSelectModel, desc, sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { DrizzleClient } from '@/main/db/createDb'
import { BannerId, ItemId, Rarity, UserId, GachaBannerType, WarpId, GachaItemType } from '@/common/StarRail'

export const warpTable = sqliteTable('Warp', {
    id: text('id').$type<WarpId>().primaryKey(),
    uid: text('uid').$type<UserId>().notNull(), // user id

    bannerId: text('bannerId').$type<BannerId>().notNull(), // gacha_id
    bannerType: text('bannerType').$type<GachaBannerType>().notNull(),

    itemId: text('itemId').$type<ItemId>().notNull(),
    itemType: text('itemType').$type<GachaItemType>().notNull(),
    itemName: text('itemName').notNull(),
    rarity: integer('rarity').$type<Rarity>().notNull(),

    pulledAt: text('pulledAt').notNull(),
})

export type Warp = InferSelectModel<typeof warpTable>
type InsertModel = InferInsertModel<typeof warpTable>

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

export function existsWarp(db: DrizzleClient, id?: WarpId): boolean {
    if (!id) {
        return false
    }

    return db.get<{ exists: 0 | 1 }>(sql`
        SELECT EXISTS (
            SELECT 1
            FROM
                ${warpTable}
            WHERE
                ${warpTable.id} = ${id}
        ) AS 'exists'
    `).exists === 1
}

export function selectWarps(db: DrizzleClient, bannerType: GachaBannerType): Array<Warp> {
    return db
        .select()
        .from(warpTable)
        .orderBy(desc(warpTable.pulledAt))
        .where(sql`${warpTable.bannerType} = ${bannerType}`)
        .all()
}

export function insertWarp(db: DrizzleClient, payload: InsertModel) {
    return db
        .insert(warpTable)
        .values(payload)
        .onConflictDoNothing()
        .returning()
        .get()
}

export function deleteWarps(db: DrizzleClient, bannerType: GachaBannerType) {
    return db
        .delete(warpTable)
        .where(sql`${warpTable.bannerType} = ${bannerType}`)
        .returning()
        .all()
}
