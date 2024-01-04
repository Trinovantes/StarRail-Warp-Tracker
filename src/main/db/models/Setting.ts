import { InferInsertModel, InferSelectModel, sql } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { DrizzleClient } from '@/main/db/createDb'
import { SettingKey } from './SettingKey'

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
