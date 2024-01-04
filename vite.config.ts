import path from 'node:path'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import ViteRequireContext from '@originjs/vite-plugin-require-context'
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

    plugins: [
        vue(),
        ViteRequireContext(),
    ],

    test: {
        restoreMocks: true,
        dir: './tests/unit',
        globalSetup: './tests/unit/setup.ts',
    },
})
