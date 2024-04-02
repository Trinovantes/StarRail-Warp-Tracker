import fs from 'node:fs/promises'
import { build } from 'electron-builder'
import webpack, { Configuration } from 'webpack'
import { logBanner } from '../src/common/utils/logBanner'
import { distDir, buildDir, electronConfig } from './BuildConstants'
import { mainConfig, preloadConfig, rendererConfig } from './weback.config.electron'

// ----------------------------------------------------------------------------
// Webpack Compiler
// ----------------------------------------------------------------------------

function compileWebpack(config: Configuration): Promise<void> {
    return new Promise((resolve, reject) => {
        const compiler = webpack(config)
        compiler.run((error) => {
            if (error) {
                reject(error)
            } else {
                resolve()
            }
        })
    })
}

// ----------------------------------------------------------------------------
// Run
// ----------------------------------------------------------------------------

async function runBuild() {
    logBanner('Cleaning Output Dir', '\n', distDir, '\n', buildDir)
    await fs.rm(distDir, { recursive: true, force: true })
    await fs.rm(buildDir, { recursive: true, force: true })

    logBanner('Compiling Webpack...')
    await Promise.all([
        compileWebpack(mainConfig),
        compileWebpack(preloadConfig),
        compileWebpack(rendererConfig),
    ])

    logBanner('Building Electron')
    await build({
        config: electronConfig,
        publish: 'onTag',
    })
}

runBuild().catch((err: unknown) => {
    console.error(err)
    process.exit(1)
})
