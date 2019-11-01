const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devServer: {
    open: true
  }
})

module.exports = devWebpackConfig;
