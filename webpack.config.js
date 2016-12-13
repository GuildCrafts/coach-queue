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
const processDotEnvPlugin = new webpack.DefinePlugin({
  'process.env.APP_URL':   JSON.stringify(process.env.APP_URL),
  'process.env.NODE_ENV':  JSON.stringify(process.env.NODE_ENV),
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
  plugins: [processDotEnvPlugin, HTMLWebpackPluginConfig]
}
