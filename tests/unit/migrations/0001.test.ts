import { describe, expect, beforeEach } from 'vitest'
import { type DbFixtures, dbTest } from '../fixtures/dbTest.ts'

describe('0001', () => {
    beforeEach<DbFixtures>(async ({ migrateToVersion }) => {
        await migrateToVersion(1)
    })

    dbTest('it creates "Setting" table', ({ getTableColumns }) => {
        const columns = getTableColumns('Setting')
        expect(columns.length).toBe(2)

        expect(columns[0].name).toBe('key')
        expect(columns[1].name).toBe('value')
    })
})
