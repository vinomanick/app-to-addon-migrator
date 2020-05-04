#!/usr/bin/env node

const argv  =  require('yargs')
  .usage('Usage: $0 [mixin-folder] [mixin-name] [engine-name] --dry-run')
  .demand(3)
  .alias('d', 'dry-run')
  .argv;

const fs = require('fs');
const fse = require('fs-extra');
const { log, error, ok, warning } = require('./logging');

const { dryRun } = argv;
const mixinPath = 'app/mixins';
const packagePath = 'packages/engines';

const [mixinFolder, mixinName, engineName] = argv._;

// Moving mixin.js
log('Moving mixin.js');
log('---------------');
const sourcemixin = `${mixinPath}/${mixinFolder}/${mixinName}.js`;
const destmixin = `${packagePath}/${engineName}/addon/mixins/${mixinName}.js`;

log(sourcemixin);
log(destmixin);

if (!dryRun) {
  fse.copy(sourcemixin, destmixin)
    .then(() => {
      ok(`Success: mixin ${mixinName}.js copied`);
    })
    .catch((err) => error(err));
}

// Moving mixin tests
log('\nMoving mixin tests');
log('------------------');
const sourceTest = `tests/unit/mixins/${mixinFolder}/${mixinName}-test.js`;
const destTest = `${packagePath}/${engineName}/tests/unit/mixins/${mixinName}-test.js`;

log(sourceTest);
log(destTest);
if (!dryRun) {
  if (fs.existsSync(sourceTest)) {
    fse.copy(sourceTest, destTest)
      .then(() => {
        ok(`Success: mixin Test ${mixinName}.hbs copied`);
      })
      .catch((err) => error(err));
  } else {
    warning(`WARNING: There are no unit tests for mixin ${mixinName}`);
  }
}

