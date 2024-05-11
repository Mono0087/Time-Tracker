const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: [
          'style-loader', // 3. inject style into DOM
          'css-loader', // 2. turns css into js
          'postcss-loader', // 1. turns postcss to css
        ],
      },
    ],
  },
  devtool: 'source-map',
})
