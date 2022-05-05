const WebpackBar = require('webpackbar');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { appIndexJs, appSrc, appHtml, appDist } = require('./paths');
const path = require('path');

module.exports = {
  stats: 'errors-only',
  cache: true,
  entry: {
    index: appIndexJs,
  },
  output: {
    path: appDist,
    filename: '[name].[contenthash:8].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: ['node_modules'],
    alias: {
      '@': appSrc,
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'vendor',
    },
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        loader: require.resolve('babel-loader'),
        include: appSrc,
        options: {
          babelrc: false,
          configFile: false,
          compact: false,
          cacheDirectory: true,
          presets: [
            require('@babel/preset-typescript').default,
            [
              require('@babel/preset-env'),
              {
                useBuiltIns: 'usage',
                corejs: 3,
                modules: false,
              },
            ],
            [
              require('@babel/preset-react'),
              {
                runtime: 'automatic',
              },
            ],
          ],
          plugins: [
            [require('@babel/plugin-proposal-decorators').default, { legacy: true }],
            [
              require('babel-plugin-import').default,
              {
                libraryName: 'antd',
                libraryDirectory: 'lib',
                style: true,
              },
            ],
            [
              require('@babel/plugin-transform-runtime').default,
              {
                corejs: false,
                version: require('@babel/runtime/package.json').version,
                regenerator: true,
                useESModules: true,
                absoluteRuntime: path.dirname(require.resolve('@babel/runtime/package.json')),
              },
            ],
            require.resolve('./babelPluginAutoCssModules'),
          ],
        },
      },
    ],
  },
  plugins: [
    new WebpackBar(),
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      minify: true,
      template: appHtml,
      filename: 'index.html',
      chunks: ['index'],
      inject: true,
    }),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
    }),
  ],
};
