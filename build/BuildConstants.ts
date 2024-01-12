import path from 'node:path'
import { getGitHash } from './BuildSecret'
import packageJson from '../package.json'
import { Configuration } from 'electron-builder'

// Assume we are running webpack from the project root (../)
const rootDir = path.resolve()

export const isDev = (process.env.NODE_ENV === 'development')
export const gitHash = getGitHash(rootDir)
export const devServerPort = 8080

export const installerAssets = path.resolve(rootDir, 'build', 'installer')
export const distDir = path.resolve(rootDir, 'dist') // For development
export const buildDir = path.resolve(rootDir, 'dist-package') // Final packaged installer for distribution

export const srcDir = path.resolve(rootDir, 'src')
export const srcMainDir = path.resolve(srcDir, 'main')
export const srcRendererDir = path.resolve(srcDir, 'renderer')

export const buildConstants = {
    __VUE_OPTIONS_API__: JSON.stringify(false),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),

    'DEFINE.IS_DEV': JSON.stringify(isDev),
    'DEFINE.GIT_HASH': JSON.stringify(gitHash),
    'DEFINE.DEV_SERVER_PORT': JSON.stringify(devServerPort),
    'DEFINE.APP_VERSION': JSON.stringify(packageJson.version),
    'DEFINE.APP_PRODUCT_NAME': JSON.stringify(packageJson.productName),
    'DEFINE.APP_HOMEPAGE': JSON.stringify(packageJson.homepage),
}

export const electronConfig: Configuration = {
    appId: packageJson.appId,

    publish: {
        provider: 'github',
        releaseType: 'release',
    },

    directories: {
        output: buildDir,
        buildResources: installerAssets,
    },

    files: [
        'package.json',
        'dist',
    ],

    win: {
        target: 'nsis',
        icon: path.resolve(installerAssets, 'icon.ico'),
    },

    nsis: {
        // one-click installer i.e. skip asking for install location
        oneClick: true,

        // (true)  install to C:\Program Files
        // (false) install to C:\Users\Stephen\AppData\Local
        perMachine: false,
    },
}
