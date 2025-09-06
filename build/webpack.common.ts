import webpack from 'webpack'
import { buildConstants, isDev, srcRendererDir } from './BuildConstants.ts'
import path from 'node:path'

const commonConfig: webpack.Configuration = {
    mode: isDev
        ? 'development'
        : 'production',
    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json', 'scss', '.css'],
        alias: {
            '@css': path.resolve(srcRendererDir, 'client', 'assets', 'css'),
            '@img': path.resolve(srcRendererDir, 'client', 'assets', 'img'),
            '@layouts': path.resolve(srcRendererDir, 'client', 'layouts'),
            '@pages': path.resolve(srcRendererDir, 'client', 'pages'),
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
