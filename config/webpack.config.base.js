const path = require('path');
const fs = require('fs');
const glob = require('glob-fs')();

// Plugins
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Variables

const PATHS = require('./paths');
const PAGES = glob.readdirSync('./src/views/pages/**/*.pug');

module.exports = {
  entry: {
    app: [
      `${PATHS.src}/js/main.js`,
      `${PATHS.src}/${PATHS.assets}/sass/main.sass`
    ]
  },
  output: {
    filename: './js/[name].[hash].js',
    path: path.resolve(__dirname, PATHS.public),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: { url: false }
          },
          {
            loader: 'postcss-loader',
            options: { config: { path: './postcss.config.js' } }
          }
        ]
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: { url: false }
          },
          {
            loader: 'postcss-loader',
            options: { config: { path: './postcss.config.js' } }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [
                  'node_modules'
                ]
              }              
            }
          }
        ]
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: { name: '[name].[ext]' }
      },
      {
        test: /\.(img|png|svg|jp(e)?g)$/,
        loader: 'file-loader',
        options: { name: '[name].[ext]' }
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          // enforce: true
        }
      }
    }
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin(),    
    new MiniCssExtractPlugin({
      filename: './css/app.[hash].css'
    }),
    new CopyWebpackPlugin([
      { from: `${PATHS.src}/${PATHS.assets}img`, to: './img' },
      { from: `${PATHS.src}/${PATHS.assets}fonts`, to: './fonts' },
      { from: `${PATHS.src}/other`, to: './' }
    ]),
    ...PAGES.map(page => {  
      page = page.substring('sushkapola.ru/'.length);      
      return new HtmlWebpackPlugin({
        filename: `${page.match(/(?<=src\/views\/pages\/).*(?=\.pug$)/g)}.html`,
        template: page,
        inject: true
      })
    })
  ],
  stats: false
}
