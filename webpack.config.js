const path = require('path');

const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV ? true : false;

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: './app/src/js/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, isDevelopment ? 'app/public/js/' : 'dist/js/')
  },
  performance: {
    hints: false
  },
  devtool: isDevelopment ? 'cheap-module-eval-source-map' : false
}