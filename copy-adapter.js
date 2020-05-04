#!/usr/bin/env node

const argv  =  require('yargs')
  .usage('Usage: $0 [adapter-name] [engine-name] [adapter-folder] --dry-run')
  .demand(2)
  .alias('d', 'dry-run')
  .argv;

const fs = require('fs');
const fse = require('fs-extra');
const { log, error, ok, warning } = require('./logging');

const { dryRun } = argv;
const adapterPath = 'app/adapters';
const packagePath = 'packages/engines';

const [adapterName, engineName, adapterFolder] = argv._;

// Moving adapter.js
log('Moving adapter.js');
log('---------------');
const sourceadapter = adapterFolder ? `${adapterPath}/${adapterFolder}/${adapterName}.js`
  : `${adapterPath}/${adapterName}.js`;
const destadapter = `${packagePath}/${engineName}/addon/adapters/${adapterName}.js`;

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
const destTest = `${packagePath}/${engineName}/tests/unit/adapters/${adapterName}-test.js`;

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

const appadapter = `${packagePath}/${engineName}/app/adapters/${adapterName}.js`;
const adapterBody = `export { default } from '${engineName}/adapters/${adapterName}';`;
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
