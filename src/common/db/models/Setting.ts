import { type InferInsertModel, type InferSelectModel, sql } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import type { SettingKey } from './SettingKey.ts'
import type { DrizzleClient } from '../createDb.ts'

export const settingTable = sqliteTable('Setting', {
    key: text('key').primaryKey(),
    value: text('value').notNull(),
})

export type Setting = InferSelectModel<typeof settingTable>
type InsertModel = InferInsertModel<typeof settingTable>

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

export function selectSetting(db: DrizzleClient, key: SettingKey): string | undefined {
    return db
        .select()
        .from(settingTable)
        .where(sql`${settingTable.key} = ${key}`)
        .get()
        ?.value
}

export function insertSetting(db: DrizzleClient, payload: InsertModel) {
    return db
        .insert(settingTable)
        .values(payload)
        .onConflictDoUpdate({
            target: settingTable.key,
            set: {
                value: payload.value,
            },
        })
        .run()
}
