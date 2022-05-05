const jest = require('jest');
let argv = process.argv.slice(2);
const createJestConfig = require('./utils/createJestConfig');
const path = require('path');
const paths = require('../config/paths');
argv.push(
  '--config',
  JSON.stringify(
    createJestConfig(
      (relativePath) => path.resolve(__dirname, '..', relativePath),
      path.resolve(paths.appSrc, '..'),
      false,
    ),
  ),
);
jest.run(argv);
