const webpack = require('webpack');
const { merge } = require('webpack-merge');
const webpackBase = require('./webpack.base');
const { appSrc } = require('./paths');

module.exports = merge(webpackBase, {
  mode: 'development',
  devtool: 'eval-source-map',
  // entry: {
  //   // Runtime code for hot module replacement
  //   hot: require.resolve('webpack/hot/dev-server'),

  //   // Dev server client for web socket transport, hot and live reload logic
  //   client: require.resolve('webpack-dev-server/client') + '?hot=true&live-reload=true',
  // },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: appSrc,
        use: [require.resolve('style-loader'), require.resolve('css-loader')],
      },
      {
        test: /\.scss$/,
        include: appSrc,
        oneOf: [
          {
            resourceQuery: /modules/,
            use: [
              require.resolve('style-loader'),
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
              require.resolve('style-loader'),
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
    // Plugin for hot module replacement
    // new webpack.HotModuleReplacementPlugin(),
  ],
});
