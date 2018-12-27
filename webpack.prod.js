const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const common = require('./webpack.common.js');
const options = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    output: {
        publicPath: '/',//可配置cdn缓存文件地址
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            //use previous loader sourceMap
                            sourceMap: true
                        }
                    }]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            //use previous loader sourceMap
                            sourceMap: true
                        }
                    },
                    'sass-loader']
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    MiniCssPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            //use previous loader sourceMap
                            sourceMap: true
                        }
                    },
                    'stylus-loader',
                    {
                        loader: 'style-resources-loader',
                        options: {
                            patterns: [
                                path.resolve(__dirname, 'src/common/stylus/variable.styl'),
                                path.resolve(__dirname, 'src/common/stylus/mixin.styl')
                            ],
                            injector: (source, resources) => {
                                const combineAll = type => resources
                                    .filter(({ file }) => file.includes(type))
                                    .map(({ content }) => content)
                                    .join('');

                                return combineAll('variable') + combineAll('mixin') + source;
                            }
                        }
                    }]
            }
        ]

    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                exclude: /\.min\.js$/, // 过滤掉以".min.js"结尾的文件，我们认为这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
                cache: true,
                parallel: true, // 开启并行压缩，充分利用cpu
                sourceMap: false,
                extractComments: false, // 移除注释
                uglifyOptions: {
                    compress: {
                        unused: true,
                        warnings: false,
                        drop_debugger: true,
                        drop_console: true
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        comments: false
                    }
                }
            }),
            // 用于优化css文件
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessorOptions: {
                    safe: true,
                    autoprefixer: { disable: true }, //
                    mergeLonghand: false,
                    discardComments: {
                        removeAll: true // 移除注释
                    }
                },
                canPrint: true
            })
        ],
        splitChunks: {
            cacheGroups: {
                vendor: { // 将第三方模块提取出来
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    name: 'vendor'
                }
            }
        },
        runtimeChunk: {name: 'runtime'}
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),//clean dist
        new MiniCssPlugin({
            filename: '[name].css',
            chunkFilename: '[name].[contenthash:8].css'
        }),
        new OptimizeCssAssetsPlugin(),//compress css file
        // Reduces bundles total size
        new webpack.HashedModuleIdsPlugin(),//only update files which has changed
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.production.html',
            inject: 'body',
            favicon: 'src/favicon.ico',
            chunksSortMode: 'none',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                minifyJS: true,
                minifyCSS: true
            }
        })
    ]
});
module.exports = options;
