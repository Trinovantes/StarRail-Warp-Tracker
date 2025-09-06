import { describe, expect, beforeEach } from 'vitest'
import { type DbFixtures, dbTest } from '../fixtures/dbTest.ts'

describe('0002', () => {
    beforeEach<DbFixtures>(async ({ migrateToVersion }) => {
        await migrateToVersion(2)
    })

    dbTest('it creates "Warp" table', ({ getTableColumns }) => {
        const columns = getTableColumns('Warp')
        expect(columns.length).toBe(9)

        expect(columns[0].name).toBe('id')
        expect(columns[1].name).toBe('uid')

        expect(columns[2].name).toBe('bannerId')
        expect(columns[3].name).toBe('bannerType')

        expect(columns[4].name).toBe('itemId')
        expect(columns[5].name).toBe('itemType')
        expect(columns[6].name).toBe('itemName')
        expect(columns[7].name).toBe('rarity')

        expect(columns[8].name).toBe('pulledAt')
    })
})
