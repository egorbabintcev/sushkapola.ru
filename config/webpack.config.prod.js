const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const prodWebpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: '/node_modules/',
        loader: 'eslint-loader',
        options: {
          cache: true,
          fix: true
        }
      }
    ]
  }
})

module.exports = prodWebpackConfig;
