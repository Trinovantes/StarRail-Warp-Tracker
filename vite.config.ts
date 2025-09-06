import { defineConfig } from 'vitest/config'
import { buildConstants } from './build/BuildConstants.js'

export default defineConfig({
    define: {
        ...buildConstants,
    },

    test: {
        restoreMocks: true,
        dir: './tests/unit',
        globalSetup: './tests/unit/setup.ts',
    },
})
