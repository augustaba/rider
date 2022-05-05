const webpackDev = require('./webpack.dev');
const webpackProd = require('./webpack.prod');

module.exports = function (env) {
  const isDevelopment = env === 'development';
  return isDevelopment ? webpackDev : webpackProd;
};
