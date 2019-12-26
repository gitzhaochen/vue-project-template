const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const common = require('./webpack.common.js')
const options = merge(common, {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  entry: path.join(process.cwd(), 'src/main.js'),
  output: {
    filename: '[name].[chunkhash:8].js',
    publicPath: '',
    chunkFilename: '[name].[chunkhash:8].bundle.js',
    path: path.join(process.cwd(), 'build-dist')
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
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssPlugin.loader,
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          'sass-loader'
        ]
      },
      {
        test: /\.styl(us)?$/,
        use: [
          MiniCssPlugin.loader,
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          'stylus-loader',
          {
            loader: 'style-resources-loader',
            options: {
              patterns: [
                path.join(process.cwd(), 'src/assets/stylus/variable.styl'),
                path.join(process.cwd(), 'src/assets/stylus/mixin.styl')
              ],
              injector: (source, resources) => {
                const combineAll = type =>
                  resources
                    .filter(({ file }) => file.includes(type))
                    .map(({ content }) => content)
                    .join('')

                return combineAll('variable') + combineAll('mixin') + source
              }
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        exclude: /\.min\.js$/, // 过滤掉以".min.js"结尾的文件，我们认为这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
        cache: true,
        parallel: true, // 开启并行压缩，充分利用cpu
        sourceMap: false,
        extractComments: false, // 移除注释
        terserOptions: {
          compress: {
            drop_debugger: true,
            drop_console: true
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
      chunks: 'all', //initial:入口文件 async:动态导入的模块 all:包括所有
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 7, //动态模块最大可并行请求次数
      maxInitialRequests: 5, //入口模块最大可并行请求次数
      automaticNameDelimiter: '.',
      name: true,
      cacheGroups: {
        corejs: {
          test: /node_modules[\\/]core-js/,
          priority: 20
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 15
        },
        commons: {
          minChunks: 2,
          priority: 10,
          reuseExistingChunk: true // 这个配置允许我们使用已经存在的代码块
        }
      }
    },
    runtimeChunk: 'single'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssPlugin({
      filename: '[name].css',
      chunkFilename: '[name].[contenthash:8].css'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HashedModuleIdsPlugin(), //only update files which has changed
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.production.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true,
        minifyCSS: true
      }
    })
  ]
})
module.exports = options
