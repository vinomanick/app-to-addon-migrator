'use strict';

module.exports.command = 'adapter <adapter-name> <addon-name>';
module.exports.desc = 'Copy an adapter from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('adapter-name', {
    describe: 'The name of the adapter to copy',
  })
  yargs.positional('addon-name', {
    describe: 'The name of the addon folder to copy to',
  })
  yargs.positional('adapter-folder', {
    describe: 'The name of the adapter folder if it is namespaced within app/adapters',
  });
};

module.exports.handler = async function handler(options) {

const fs = require('fs');
const fse = require('fs-extra');
const { log, error, ok, warning } = require('../utils/logging');

const adapterPath = 'app/adapters';
const packagePath = 'packages/engines';

const {adapterName, addonName, adapterFolder, dryRun} = options;

// Moving adapter.js
log('Moving adapter.js');
log('---------------');
const sourceadapter = adapterFolder ? `${adapterPath}/${adapterFolder}/${adapterName}.js`
  : `${adapterPath}/${adapterName}.js`;
const destadapter = `${packagePath}/${addonName}/addon/adapters/${adapterName}.js`;

log(sourceadapter);
log(destadapter);

if (!dryRun) {
  fse.copy(sourceadapter, destadapter)
    .then(() => {
      ok(`Success: Adapter ${adapterName}.js copied`);
    })
    .catch((err) => error(err));
}

// Moving adapter tests
log('\nMoving adapter tests');
log('------------------');
const sourceTest = adapterFolder ? `tests/unit/adapters/${adapterFolder}/${adapterName}-test.js`
  : `tests/unit/adapters/${adapterName}-test.js`;
const destTest = `${packagePath}/${addonName}/tests/unit/adapters/${adapterName}-test.js`;

log(sourceTest);
log(destTest);
if (!dryRun) {
  if (fs.existsSync(sourceTest)) {
    fse.copy(sourceTest, destTest)
      .then(() => {
        ok(`Success: Adapter Test ${adapterName}.hbs copied`);
      })
      .catch((err) => error(err));
  } else {
    warning(`WARNING: There are no unit tests for adapter ${adapterName}`);
  }
}

// Create adapter assets to app folder in addon

log('\nCreating adapter assets in app folder ');
log('----------------------------------- ');

const appadapter = `${packagePath}/${addonName}/app/adapters/${adapterName}.js`;
const adapterBody = `export { default } from '${addonName}/adapters/${adapterName}';`;
log(appadapter);
if (!dryRun) {
  fse.outputFile(appadapter, adapterBody)
    .then(() => {
      ok(`Success: Adapter ${adapterName}.js created in app`);
    })
    .catch((err) => {
      console.error(err);
    });
}

};
