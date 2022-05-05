'use strict';

const babelJest = require('babel-jest').default;

module.exports = babelJest.createTransformer({
  presets: [
    [require('@babel/preset-env'), { targets: { node: 'current' } }],
    require('@babel/preset-typescript').default,
    [
      require('@babel/preset-react'),
      {
        runtime: 'automatic',
      },
    ],
  ],
  babelrc: false,
  configFile: false,
});
