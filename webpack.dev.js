const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
 

module.exports = {
  entry: {
    background: './src/background/index.js',
    content: './src/content/index.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jp?g|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: '../dist/',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.jsx', '.ts', '.js'],
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({ template: 'src/popup/index.html' }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/manifest.json' },
        { from: './src/icons/icon16.png' },
        { from: './src/icons/icon48.png' },
        { from: './src/icons/icon128.png' },
        
      ],
    }),
  ],
  output: { filename: '[name].js', path: path.resolve(__dirname, 'dist') }, // chrome will look for files under dist/* folder
}