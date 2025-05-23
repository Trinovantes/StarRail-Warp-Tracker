import { DbFixtures, dbTest } from '../fixtures/dbTest'
import { selectSetting } from '@/common/db/models/Setting'
import { existsSync, statSync, createReadStream, Stats, ReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import { expect, describe, vi, beforeEach } from 'vitest'

const testGameDir = 'D:/Somewhere/Star Rail/Games/StarRail_Data'

const mocks = vi.hoisted(() => {
    return {
        existsSync: vi.fn(),
        statSync: vi.fn(),
        createReadStream: vi.fn(),
    }
})

vi.mock('fs', () => {
    return {
        existsSync: mocks.existsSync,
        statSync: mocks.statSync,
        createReadStream: mocks.createReadStream,
    }
})

beforeEach(() => {
    vi.mocked(existsSync).mockReturnValue(true)

    vi.mocked(statSync).mockReturnValue({
        size: 10n,
    } as unknown as Stats)

    vi.mocked(createReadStream).mockReturnValue(new Readable({
        read() {
            this.push(`Loading player data from ${testGameDir}/data.unity3d`)
            this.push(null)
        },
    }) as ReadStream)
})

describe('0003', () => {
    beforeEach<DbFixtures>(async({ migrateToVersion }) => {
        await migrateToVersion(3)
    })

    dbTest('it updates GAME_INSTALL_DIR', ({ db }) => {
        const value = selectSetting(db, 'GAME_INSTALL_DIR')
        expect(value).toBe(testGameDir)
    })
})
