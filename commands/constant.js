'use strict';

module.exports.command = 'constant [constant-name] [destination]';

module.exports.desc = 'Copy a constant from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('constant-name', {
    describe: 'The name of the constant to copy',
  });

  yargs.positional('destination', {
    describe: 'The relative path of the addon folder to copy to',
  });

  yargs.option('constant-folder', {
    alias: 'f',
    demandOption: false,
    describe: 'The name of the constant folder if it is namespaced within app/helpers',
    type: 'string',
  });
};

module.exports.handler = async function handler(options) {
  const fse = require('fs-extra');
  const path = require('path');
  const { log, error, ok } = require('../utils/logging');

  const constantPath = 'app/constants';

  const { constantName, destination, constantFolder, dryRun } = options;

  const packagePath = path.join('.', destination) || 'packages/engines';
  // Moving constant.js
  log('Moving constant.js');
  log('---------------');
  const sourceconstant = constantFolder
    ? `${constantPath}/${constantFolder}/${constantName}.js`
    : `${constantPath}/${constantName}.js`;
  const destconstant = `${packagePath}/addon/constants/${constantName}.js`;

  log(sourceconstant);
  log(destconstant);

  if (!dryRun) {
    fse
      .copy(sourceconstant, destconstant) //eslint-disable-line
      .then(() => {
        ok(`Success: constant ${constantName}.js copied`);
      })
      .catch((err) => error(err));
  }
};
