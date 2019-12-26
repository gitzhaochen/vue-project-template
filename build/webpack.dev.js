const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const options = merge(common, {
  mode: 'development',
  entry: path.join(process.cwd(), 'src/main.js'),
  output: {
    filename: '[name].js'
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.scss/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.styl(us)?$/,
        use: [
          'vue-style-loader',
          'css-loader',
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
  devServer: {
    contentBase: path.join(process.cwd(), 'dist'),
    host: '0.0.0.0',
    port: 9998,
    historyApiFallback: true, // pass router to frontend rendor when url-api not found
    hot: true,
    overlay: {
      errors: true
    }
    // proxy: {
    //   //开发环境
    //   '/dev_server_url': {
    //     target: 'http://10.0.0.35:9613',
    //     pathRewrite: { '^/dev_server_url': '' },
    //     changeOrigin: true, //传递给后端正确的Host头 true:target host、 false为localhost
    //     secure: true //支持 https
    //   },
    // }
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../dist/vendor.manifest.json')
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.development.html',
      favicon: 'src/favicon.ico',
      inject: 'body',
      hash: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
})
module.exports = options
