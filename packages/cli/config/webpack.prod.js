const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const webpackBase = require('./webpack.base');
const { appSrc } = require('./paths');

module.exports = merge(webpackBase, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'],
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: appSrc,
        use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')],
      },
      {
        test: /\.scss$/,
        include: appSrc,
        oneOf: [
          {
            resourceQuery: /modules/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: require.resolve('css-loader'),
                options: {
                  modules: {
                    localIdentName: '[local]--[contenthash:base64:5]',
                  },
                },
              },
              {
                loader: require.resolve('sass-loader'),
                options: {
                  implementation: require.resolve('sass'),
                },
              },
            ],
          },
          {
            use: [
              MiniCssExtractPlugin.loader,
              require.resolve('css-loader'),
              {
                loader: require.resolve('sass-loader'),
                options: {
                  implementation: require.resolve('sass'),
                },
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[id].[contenthash:8].css',
    }),
  ],
});
