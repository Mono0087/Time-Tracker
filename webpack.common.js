const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        // Take recourses of this type...
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset/resource',
        // ...and put it into this folder
        generator: {
          filename: 'images/[name].[hash][ext][query]',
        },
      },
      {
        test: /\.(woff2|woff)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash][ext][query]',
        },
      },
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                { targets: '>0.25%, not ie 11, not op_mini all' },
              ],
            ],
            cacheDirectory: true,
          },
        },
      },
    ],
  },
}
