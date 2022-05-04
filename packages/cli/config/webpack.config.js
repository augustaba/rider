const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require('webpackbar');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { appIndexJs, appSrc, appNodeModules, appHtml, appDist } = require('./paths');
const path = require('path');

module.exports = function (env) {
  const isDevelopment = env === 'development';
  const isProduction = env === 'production';
  return {
    mode: isProduction ? 'production' : isDevelopment && 'development',
    devtool: isDevelopment ? 'eval-source-map' : false,
    stats: 'errors-only',
    cache: true,
    entry: {
      index: appIndexJs,
    },
    output: {
      path: appDist,
      filename: '[name].[hash:8].js',
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
      minimize: !isDevelopment,
      minimizer: [
        !isDevelopment &&
          new TerserPlugin({
            extractComments: false,
            terserOptions: {
              compress: {
                pure_funcs: ['console.log'],
              },
            },
          }),
        !isDevelopment && new CssMinimizerPlugin(),
      ].filter(Boolean),
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
              require('@babel/preset-react').default,
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
        {
          test: /\.css$/,
          include: appSrc,
          use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')],
        },
        {
          test: /\.css$/,
          include: appSrc,
          use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')],
        },
        {
          test: /\.s?css$/,
          oneOf: [
            {
              resourceQuery: /modules/,
              use: [
                MiniCssExtractPlugin.loader,
                {
                  loader: require.resolve('css-loader'),
                  options: { modules: true, exportOnlyLocals: false },
                },
                'sass-loader',
              ],
            },
            {
              use: [MiniCssExtractPlugin.loader, require.resolve('css-loader'), require.resolve('sass-loader')],
            },
          ],
        },
      ],
    },
    plugins: [
      new WebpackBar(),
      new CleanWebpackPlugin(),
      new ForkTsCheckerWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[hash:8].css',
        chunkFilename: '[id].[hash:8].css',
      }),
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
};
