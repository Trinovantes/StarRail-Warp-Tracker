import 'webpack-dev-server'
import path from 'node:path'
import { merge } from 'webpack-merge'
import CspHtmlWebpackPlugin from 'csp-html-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import { srcRendererDir, srcMainDir, srcDir } from './BuildConstants'
import commonConfig from './webpack.common'
import UnpluginVueComponents from 'unplugin-vue-components/webpack'
import { QuasarResolver } from 'unplugin-vue-components/resolvers'

// ----------------------------------------------------------------------------
// Main Process
// ----------------------------------------------------------------------------

export const mainConfig = merge(commonConfig, {
    name: 'mainConfig',

    target: 'electron-main',

    entry: {
        main: path.resolve(srcMainDir, 'main.ts'),
    },
})

// ----------------------------------------------------------------------------
// Preload
// ----------------------------------------------------------------------------

export const preloadConfig = merge(commonConfig, {
    name: 'preloadConfig',

    target: 'electron-preload',

    entry: {
        preload: path.resolve(srcMainDir, 'preload.ts'),
    },
})

// ----------------------------------------------------------------------------
// Renderer Process
// ----------------------------------------------------------------------------

export const rendererConfig = merge(commonConfig, {
    name: 'renderConfig',

    // Don't use 'electron-renderer' target because it assumes nodeIntegration is enabled
    // Assuming we implemented our preloader correctly, our frontend is just a normal website that doesn't directly utilize any unsafe APIs
    target: 'web',

    entry: {
        renderer: path.resolve(srcRendererDir, 'renderer.ts'),
    },

    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(srcRendererDir, 'index.html'),
        }),
        new CspHtmlWebpackPlugin({
            'base-uri': ["'self'"],
            'object-src': ["'none'"],
            'script-src': ["'self'"],
            'style-src': ["'self'"],
            'frame-src': ["'none'"],
            'worker-src': ["'none'"],
        }),
        UnpluginVueComponents({
            dts: path.resolve(srcDir, '@types', 'components.d.ts'),
            resolvers: [
                QuasarResolver(),
            ],
        }),
    ],

    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [{
                    loader: 'vue-loader',
                }],
            },
            {
                test: /\.(sass|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            additionalData: (content: string, loaderContext: { resourcePath: string }): string => {
                                return (loaderContext.resourcePath.endsWith('sass'))
                                    ? '@use "sass:math"\n @import "@/renderer/client/assets/css/variables.scss"\n' + content
                                    : '@use "sass:math";  @import "@/renderer/client/assets/css/variables.scss"; ' + content
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(ttf|eot|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                type: 'asset',
            },
            {
                test: /\.(jpe?g|png|gif|svg|webp)$/i,
                use: [
                    {
                        loader: 'responsive-loader',
                        options: {
                            format: 'webp',
                        },
                    },
                ],
            },
        ],
    },
})
