import path, { dirname } from 'node:path'
import { srcRendererDir } from '../../build/BuildConstants.ts'
import { readdirSync, mkdirSync, createWriteStream } from 'node:fs'

// ----------------------------------------------------------------------------
// Downloads HSR icons from https://github.com/Mar-7th/StarRailRes
// This script should be run once every patch to keep icons up to date
// ----------------------------------------------------------------------------

const githubApiUrl = 'https://api.github.com/repos/Mar-7th/StarRailRes/git/trees/master?recursive=1'
const repoBaseUrl = 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/master'
const destBaseDir = path.join(srcRendererDir, 'client/assets/img/game')
const desiredAssetPatterns = [
    /^icon\/light_cone\/(\d+)\.png/,
    /^icon\/character\/(\d+)\.png/,
]

async function main() {
    const assetList = await fetchAssetList()
    const localAssets = getLocalAssets()

    for (const assetPath of assetList) {
        if (!isDesiredAsset(assetPath)) {
            continue
        }

        const destPath = path.join(destBaseDir, assetPath)
        if (localAssets.has(destPath)) {
            console.info(`Already have ${assetPath}`)
            continue
        }

        const destDir = dirname(destPath)
        mkdirSync(destDir, { recursive: true })

        const url = `${repoBaseUrl}/${assetPath}`
        const res = await fetch(url)
        if (res.status !== 200) {
            throw new Error(`Failed to fetch ${url}`)
        }
        if (!res.body) {
            throw new Error('Missing res.body')
        }

        const fileStream = createWriteStream(destPath)
        await res.body.pipeTo(new WritableStream({
            write: (chunk) => {
                fileStream.write(chunk)
            },
            close: () => {
                console.info(`File writer finished ${url}`)
            },
            abort: (err: Error) => {
                console.warn(`File writer encountered an error ${url}: ${err.message}`)
            },
        }))
    }
}

void main()

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function setUnion<T>(dest: Set<T>, src: Set<T>) {
    for (const item of src) {
        dest.add(item)
    }
}

async function fetchAssetList() {
    const res = await fetch(githubApiUrl)
    if (res.status !== 200) {
        throw new Error('Failed to fetchFileList')
    }

    const data = await res.json() as {
        tree: Array<{
            path: string
        }>
    }

    return data.tree.map((item) => item.path)
}

function getLocalAssets() {
    const getContents = (currentDir: string) => {
        const fileNames = new Set<string>()
        const items = readdirSync(currentDir, { withFileTypes: true })

        for (const item of items) {
            const itemPath = path.join(currentDir, item.name)

            if (item.isDirectory()) {
                setUnion(fileNames, getContents(itemPath))
            } else {
                fileNames.add(itemPath)
            }
        }

        return fileNames
    }

    return getContents(destBaseDir)
}

function isDesiredAsset(remotePath: string) {
    for (const pattern of desiredAssetPatterns) {
        if (pattern.test(remotePath)) {
            return true
        }
    }

    return false
}
