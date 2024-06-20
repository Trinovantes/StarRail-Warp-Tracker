import { getCacheFilePath } from '@/main/ipc/WarpTracker/getCacheFilePath'
import { Dirent, existsSync, readdirSync } from 'node:fs'
import { test, expect, describe, vi, beforeEach } from 'vitest'
import path from 'upath'

const mocks = vi.hoisted(() => {
    return {
        existsSync: vi.fn(),
        readdirSync: vi.fn(),
    }
})

vi.mock('fs', () => {
    return {
        existsSync: mocks.existsSync,
        readdirSync: mocks.readdirSync,
    }
})

beforeEach(() => {
    vi.mocked(existsSync).mockReturnValue(true)
    vi.mocked(readdirSync).mockReturnValue([
        {
            isDirectory: () => true,
            name: '0.0.0.0',
        } as unknown as Dirent,
    ])
})

describe('when inside WSL', () => {
    const isWsl = true
    const cacheFilePath = 'Games/StarRail_Data/webCaches/0.0.0.0/Cache/Cache_Data/data_2'

    test('resolves C:\\ (windows slash) drive to /mnt/c/', () => {
        expect(getCacheFilePath('C:\\', isWsl)).toBe(path.join('/mnt/c/', cacheFilePath))
    })

    test('resolves C:/ (posix slash) drive to /mnt/c/', () => {
        expect(getCacheFilePath('C:/', isWsl)).toBe(path.join('/mnt/c/', cacheFilePath))
    })

    test('resolves default install drive to /mnt/c/Program Files/Star Rail/', () => {
        expect(getCacheFilePath('C:\\Program Files\\Star Rail', isWsl)).toBe(path.join('/mnt/c/Program Files/Star Rail', cacheFilePath))
    })
})

describe('when outside WSL', () => {
    const isWsl = false
    const cacheFilePath = 'Games/StarRail_Data/webCaches/0.0.0.0/Cache/Cache_Data/data_2'

    test('resolves C:\\ (windows slash) drive to C:/', () => {
        expect(getCacheFilePath('C:\\', isWsl)).toBe(path.join('C:/', cacheFilePath))
    })

    test('resolves C:/ (posix slash) drive to C:/', () => {
        expect(getCacheFilePath('C:\\', isWsl)).toBe(path.join('C:/', cacheFilePath))
    })

    test('resolves default install drive to C:/Program Files/Star Rail/', () => {
        expect(getCacheFilePath('C:\\Program Files\\Star Rail', isWsl)).toBe(path.join('C:/Program Files/Star Rail/', cacheFilePath))
    })
})

test('when webCache does not exist, it throws error', () => {
    vi.mocked(existsSync).mockReturnValue(false)
    expect(() => getCacheFilePath('anything', false)).toThrowError(/Failed to resolve webCaches/)
})

test('when webCache is empty, it throws error', () => {
    vi.mocked(readdirSync).mockReturnValue([])
    expect(() => getCacheFilePath('anything', false)).toThrowError(/No cache found inside webCaches/)
})

test('when webCache has cache with invalid version format, it throws error', () => {
    vi.mocked(readdirSync).mockReturnValue([
        {
            isDirectory: () => true,
            name: '0.0',
        } as unknown as Dirent,
    ])
    expect(() => getCacheFilePath('anything', false)).toThrowError(/Invalid version/)
})
