#!/usr/bin/env node

const argv  =  require('yargs')
  .usage('Usage: $0 [helper-name] [engine-name] [helper-folder] --dry-run')
  .demand(2)
  .alias('d', 'dry-run')
  .argv;

const fs = require('fs');
const fse = require('fs-extra');
const { log, error, ok, warning } = require('./logging');

const { dryRun } = argv;
const helperPath = 'app/helpers';
const packagePath = 'packages/engines';

const [helperName, engineName, helperFolder] = argv._;

// Moving helper.js
log('Moving helper.js');
log('---------------');
const sourcehelper = helperFolder ? `${helperPath}/${helperFolder}/${helperName}.js`
  : `${helperPath}/${helperName}.js`;
const desthelper = `${packagePath}/${engineName}/addon/helpers/${helperName}.js`;

log(sourcehelper);
log(desthelper);

if (!dryRun) {
  fse.copy(sourcehelper, desthelper)
    .then(() => {
      ok(`Success: helper ${helperName}.js copied`);
    })
    .catch((err) => error(err));
}

// Moving helper tests
log('\nMoving helper tests');
log('------------------');
const sourceTest = helperFolder ? `tests/unit/helpers/${helperFolder}/${helperName}-test.js`
  : `tests/unit/helpers/${helperName}-test.js`;
const destTest = `${packagePath}/${engineName}/tests/unit/helpers/${helperName}-test.js`;

log(sourceTest);
log(destTest);
if (!dryRun) {
  if (fs.existsSync(sourceTest)) {
    fse.copy(sourceTest, destTest)
      .then(() => {
        ok(`Success: helper Test ${helperName}.hbs copied`);
      })
      .catch((err) => error(err));
  } else {
    warning(`WARNING: There are no unit tests for helper ${helperName}`);
  }
}

// Create helper assets to app folder in addon

log('\nCreating helper assets in app folder ');
log('----------------------------------- ');

const appHelper = `${packagePath}/${engineName}/app/helpers/${helperName}.js`;
const helperBody = `export { default } from '${engineName}/helpers/${helperName}';`;
log(appHelper);
if (!dryRun) {
  fse.outputFile(appHelper, helperBody)
    .then(() => {
      ok(`Success: Helper ${helperName}.js created in app`);
    })
    .catch((err) => {
      console.error(err);
    });
}
