import assert from 'node:assert'
import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import electronPath from 'electron'
import webpack, { type Compiler, type Configuration } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { logBanner } from '../src/common/utils/logBanner.ts'
import { distDir } from './BuildConstants.ts'
import { mainConfig, preloadConfig, rendererConfig } from './weback.config.electron.ts'

/**
 * In production, everything is compiled and bundled into a static archive
 * Electron then loads the static html/js/css files
 *
 * In development, we need this entire script to setup hot module reloading (HMR) for both
 * frontend (renderer process) and backend (main process)
 *
 * Renderer process is compiled by WebpackDevServer
 * - WebpackDevServer saves its compiled results in memory (i.e. not on disk) and directly serves to localhost:8080
 * - Since Electron is basically a web browser, we can make it point to localhost:8080 during development
 *
 * Main process is compiled separately by Webpack and saved to disk (so that it can be read by Electron)
 * - Whenever main process changes, we need to restart Electron
 *
 * Most of this code is inspired by
 * https://github.com/SimulatedGREG/electron-vue/blob/a42047111091246608b36cf17dcf224cc4eaf064/template/.electron-vue/dev-runner.js
 */

// ----------------------------------------------------------------------------
// Globals
// ----------------------------------------------------------------------------

let electronProcess: ReturnType<typeof spawn> | null = null
let isRestarting = false

const PLUGIN_NAME = 'runDev.js'
const DEBUG_PORT = 5858

// ----------------------------------------------------------------------------
// Renderer Process
// ----------------------------------------------------------------------------

function compileRenderer(): Promise<void> {
    return new Promise((resolve, reject) => {
        const webpackCompiler = webpack(rendererConfig)
        if (!webpackCompiler) {
            return reject(new Error('Failed to init webpack'))
        }

        webpackCompiler.hooks.watchRun.tapAsync(PLUGIN_NAME, (compiler, cb) => {
            console.info('Compiling', rendererConfig.name, JSON.stringify(compiler.options.entry))
            cb()
        })

        webpackCompiler.hooks.done.tap(PLUGIN_NAME, (stats) => {
            console.info('Finished', rendererConfig.name)
            console.info(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false,
            }))
        })

        const webpackDevServer = new WebpackDevServer(rendererConfig.devServer ?? {}, webpackCompiler)
        webpackDevServer.startCallback((error) => {
            if (error) {
                reject(error)
            } else {
                resolve()
            }
        })
    })
}

// ----------------------------------------------------------------------------
// Main Process
// ----------------------------------------------------------------------------

function compileMain(config: Configuration): Promise<void> {
    return new Promise((resolve, reject) => {
        const webpackCompiler = webpack(config)
        if (!webpackCompiler) {
            return reject(new Error('Failed to init webpack'))
        }

        webpackCompiler.hooks.watchRun.tapAsync(PLUGIN_NAME, (compiler: Compiler, cb: () => void) => {
            console.info('Compiling', config.name, JSON.stringify(compiler.options.entry))
            cb()
        })

        webpackCompiler.hooks.done.tap(PLUGIN_NAME, (stats) => {
            console.info('Finished', config.name)
            console.info(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false,
            }))
        })

        // Trigger whenever we finish compiling (either at the start or in response to a file change)
        webpackCompiler.watch({}, (error) => {
            if (error) {
                reject(error)
            }

            if (electronProcess) {
                assert(electronProcess.pid !== undefined)

                isRestarting = true
                process.kill(electronProcess.pid)
                electronProcess = null
                startElectron()

                // There may be a delay between when Electron gets the SIGTERM signal and when it triggers 'close' event
                // Delay setting isRestarting so that the onClose hook does not trigger prematurely
                setTimeout(() => {
                    isRestarting = false
                }, 5000)
            }

            resolve()
        })
    })
}

// ----------------------------------------------------------------------------
// Electron
// ----------------------------------------------------------------------------

function startElectron() {
    logBanner('Starting Electron')
    if (electronProcess) {
        throw new Error('Electron process already exists')
    }

    electronProcess = spawn(electronPath as unknown as string, [
        `--inspect=${DEBUG_PORT}`,
        '--trace-warnings',
        path.join(distDir, 'main.cjs'),
    ])

    electronProcess.stdout?.on('data', (data: Buffer) => {
        console.info('out:', data.toString().trim())
    })

    electronProcess.stderr?.on('data', (data: Buffer) => {
        console.error('err:', data.toString().trim())
    })

    electronProcess.on('close', () => {
        if (!isRestarting) {
            // Close this script
            process.exit()
        }
    })
}

// ----------------------------------------------------------------------------
// Run
// ----------------------------------------------------------------------------

async function runDev() {
    logBanner('Cleaning Output Dir', '\n', distDir)
    await fs.rm(distDir, { recursive: true, force: true })

    logBanner('Starting Webpack')
    await Promise.all([
        compileRenderer(),
        compileMain(mainConfig),
        compileMain(preloadConfig),
    ])

    startElectron()
}

runDev().catch((err: unknown) => {
    console.error(err)
    process.exit(1)
})
