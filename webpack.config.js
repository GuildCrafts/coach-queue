const rootDir = __dirname
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: rootDir + '/client/index.html',
  filename: 'index.html',
  inject: 'body',
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true
  }
})
const APP_URL = process.env.NODE_ENV === 'production'
                ? 'PRODUCTION_URL'
                : 'http://coach-que.learnersguild.dev'
const processDotEnvPlugin = new webpack.DefinePlugin({
  'APP_URL': JSON.stringify(APP_URL)
})
module.exports = {
  entry: ['./client/main.js'],
  module: {
    loaders: [
      {test:/\.js$/, include: `${rootDir}/client`, loader: 'babel-loader'}
    ]
  },
  output: {
    filename: 'bundle.js',
    path: `${rootDir}/public/dist`
  },
  plugins: [HTMLWebpackPluginConfig, processDotEnvPlugin]
}
