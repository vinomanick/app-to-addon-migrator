'use strict';

module.exports.command = 'validator [validator-name] [addon-name]';

module.exports.desc = 'Copy a validator from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('validator-name', {
    describe: 'The name of the validator to copy',
  })
  yargs.positional('addon-name', {
    describe: 'The name of the addon folder to copy to',
  })
};

module.exports.handler = async function handler(options) {

const argv  =  require('yargs')
  .usage('Usage: $0 [validator-name] [engine-name] [validator-folder] --dry-run')
  .demand(2)
  .alias('d', 'dry-run')
  .argv;

const fs = require('fs');
const fse = require('fs-extra');
const { log, error, ok, warning } = require('../utils/logging');

const { dryRun } = argv;
const validatorPath = 'app/validators';
const packagePath = 'packages/engines';

const [validatorName, engineName, validatorFolder] = argv._;

// Moving validator.js
log('Moving validator.js');
log('---------------');
const sourcevalidator = validatorFolder ? `${validatorPath}/${validatorFolder}/${validatorName}.js`
  : `${validatorPath}/${validatorName}.js`;
const destvalidator = `${packagePath}/${engineName}/addon/validators/${validatorName}.js`;

log(sourcevalidator);
log(destvalidator);

if (!dryRun) {
  fse.copy(sourcevalidator, destvalidator)
    .then(() => {
      ok(`Success: validator ${validatorName}.js copied`);
    })
    .catch((err) => error(err));
}

// Moving validator tests
log('\nMoving validator tests');
log('------------------');
const sourceTest = validatorFolder ? `tests/unit/validators/${validatorFolder}/${validatorName}-test.js`
  : `tests/unit/validators/${validatorName}-test.js`;
const destTest = `${packagePath}/${engineName}/tests/unit/validators/${validatorName}-test.js`;

log(sourceTest);
log(destTest);
if (!dryRun) {
  if (fs.existsSync(sourceTest)) {
    fse.copy(sourceTest, destTest)
      .then(() => {
        ok(`Success: validator Test ${validatorName}.hbs copied`);
      })
      .catch((err) => error(err));
  } else {
    warning(`WARNING: There are no unit tests for validator ${validatorName}`);
  }
}

// Create validator assets to app folder in addon

log('\nCreating validator assets in app folder ');
log('----------------------------------- ');

const appvalidator = `${packagePath}/${engineName}/app/validators/${validatorName}.js`;
const validatorBody = `export { default } from '${engineName}/validators/${validatorName}';`;
log(appvalidator);
if (!dryRun) {
  fse.outputFile(appvalidator, validatorBody)
    .then(() => {
      ok(`Success: validator ${validatorName}.js created in app`);
    })
    .catch((err) => {
      console.error(err);
    });
}
};

