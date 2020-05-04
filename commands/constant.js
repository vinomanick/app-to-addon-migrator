'use strict';

module.exports.command = 'constant [constant-name] [addon-name]';

module.exports.desc = 'Copy a constant from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('constant-name', {
    describe: 'The name of the constant to copy',
  })
  yargs.positional('addon-name', {
    describe: 'The name of the addon folder to copy to',
  })
  yargs.positional('constant-folder', {
    describe: 'The name of the constant folder if it is namespaced within app/constants',
  });
};

module.exports.handler = async function handler(options) {

const fse = require('fs-extra');
const { log, error, ok } = require('../utils/logging');

const constantPath = 'app/constants';
const packagePath = 'packages/engines';

const {constantName, addonName, constantFolder, dryRun } = options;

// Moving constant.js
log('Moving constant.js');
log('---------------');
const sourceconstant = constantFolder ? `${constantPath}/${constantFolder}/${constantName}.js`
  : `${constantPath}/${constantName}.js`;
const destconstant = `${packagePath}/${addonName}/addon/constants/${constantName}.js`;

log(sourceconstant);
log(destconstant);

if (!dryRun) {
  fse.copy(sourceconstant, destconstant) //eslint-disable-line
    .then(() => {
      ok(`Success: constant ${constantName}.js copied`);
    })
    .catch((err) => error(err));
}
};
