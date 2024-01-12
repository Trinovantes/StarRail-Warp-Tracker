import assert from 'node:assert'
import path from 'node:path'
import { app, BrowserWindow } from 'electron'
import cfg from 'electron-cfg'
import contextMenu from 'electron-context-menu'
import { isSafeUrl } from '../utils/isSafeUrl'
import { LogFunctions } from 'electron-log'

contextMenu({
    showLearnSpelling: false,
    showLookUpSelection: false,
    showSearchWithGoogle: false,
    showCopyImage: false,
    showCopyImageAddress: false,
    showSaveImage: false,
    showSaveImageAs: false,
    showSaveLinkAs: false,
})

// Based on https://github.com/reZach/secure-electron-template/blob/master/app/electron/main.js
export let mainWindow: BrowserWindow | null

export function setupWindow(logger: LogFunctions): void {
    function loadMainWindow() {
        logger.info('Opening mainWindow')

        assert(!mainWindow)
        mainWindow = cfg.window().create({
            width: 1200,
            height: 800,
            frame: DEFINE.IS_DEV,
            webPreferences: {
                spellcheck: false,
                devTools: DEFINE.IS_DEV,
                nodeIntegration: false,
                nodeIntegrationInWorker: false,
                nodeIntegrationInSubFrames: false,
                contextIsolation: true,
                preload: path.resolve(__dirname, 'preload.js'),
            },
        })

        if (DEFINE.IS_DEV) {
            mainWindow.webContents.on('devtools-opened', () => {
                mainWindow?.focus()
                setImmediate(() => {
                    mainWindow?.focus()
                })
            })
            mainWindow.webContents.on('did-frame-finish-load', () => {
                mainWindow?.webContents.openDevTools()
            })
        }

        mainWindow.on('closed', () => {
            mainWindow = null
        })

        if (DEFINE.IS_DEV) {
            void mainWindow.loadURL(`http://localhost:${DEFINE.DEV_SERVER_PORT}`)
        } else {
            const url = new URL(path.resolve(__dirname, 'index.html'))
            url.protocol = 'file'
            void mainWindow.loadURL(url.toString())
        }
    }

    app.commandLine.appendSwitch('enable-unsafe-webgpu')
    app.on('ready', () => {
        loadMainWindow()

        // on macOS whenever the application is launched for the first time or relauching after being minimized
        app.on('activate', () => {
            if (mainWindow === null) {
                loadMainWindow()
            }
        })

        // on macOS it is common for applications to stay open until the user explicitly quits
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit()
            }
        })
    })

    // Block Electron from openning untrusted URLs
    app.on('web-contents-created', (createEvent, contents) => {
        contents.setWindowOpenHandler(({ url }) => {
            logger.warn(`Blocked url:${url} by setWindowOpenHandler`)
            return { action: 'deny' }
        })

        contents.on('will-navigate', (event, url) => {
            if (isSafeUrl(url)) {
                return
            }

            logger.warn(`Blocked url:${url} by will-navigate`)
            event.preventDefault()
        })

        contents.on('will-redirect', (event, url) => {
            if (isSafeUrl(url)) {
                return
            }

            logger.warn(`Blocked url:${url} by will-redirect`)
            event.preventDefault()
        })

        contents.on('will-attach-webview', (event, webPreferences, { src }) => {
            if (isSafeUrl(src)) {
                return
            }

            logger.warn(`Blocked url:${src} by will-attach-webview`)
            event.preventDefault()
        })
    })
}
