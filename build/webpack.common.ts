import path from 'node:path'
import webpack from 'webpack'
import { buildConstants, isDev, srcDir } from './BuildConstants'

const commonConfig: webpack.Configuration = {
    mode: isDev
        ? 'development'
        : 'production',
    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json', 'scss', '.css'],
        alias: {
            // Need to match aliases in tsconfig.json
            '@': path.resolve(srcDir),
        },
    },

    plugins: [
        new webpack.DefinePlugin(buildConstants),
    ],

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'esbuild-loader',
                    options: {
                        loader: 'ts',
                    },
                }],
            },
            {
                test: /\.node$/,
                loader: 'node-loader',
            },
        ],
    },

    externals: [
        {
            'better-sqlite3': 'commonjs better-sqlite3',
        },
        /^bun(:\w+)?/i,
    ],
}

export default commonConfig
