import path from 'node:path'
import { defineConfig } from 'vitest/config'
import { buildConstants } from './build/BuildConstants.js'

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },

    define: {
        ...buildConstants,
    },

    test: {
        restoreMocks: true,
        dir: './tests/unit',
        globalSetup: './tests/unit/setup.ts',
    },
})
