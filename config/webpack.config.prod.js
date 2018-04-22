const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.config.base.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');
// 配置
const webpackDevConfig = merge(webpackBaseConfig('minimize'), {
  devtool: '#source-map',
  output: {
    publicPath: './',
    filename: 'js/[name].[chunkhash].js', // [chunkhash]
    chunkFilename: 'js/[name].[chunkhash].js' // [chunkhash]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name].css',
      allChunks: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      filename: 'js/vendors.js',
      warn: false,
    }),
    new UglifyJSPlugin(),
    new HtmlWebpackPlugin({
      template: paths.appHtml,
      filename: 'index.html',
      inject: 'body',
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: false,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
});

module.exports = webpackDevConfig;
