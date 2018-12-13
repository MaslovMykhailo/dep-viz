const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    './src/js/index.js',
    './src/css/main.css'
  ],
  output: {
    filename: './bundle.js'
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/js'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src/css'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              minimize: true,
            }
          },
          
        ]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin('./dist'),
    new CopyWebpackPlugin([{
      from: 'public/media',
      to: './media'
    }
    ]),
    new MiniCssExtractPlugin({
      filename: "main.css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      files: {
        "css": [ "./main.css" ],
      }
    })
  ]
};