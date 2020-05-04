'use strict';

module.exports.command = 'mixin [mixin-name] [addon-name]';

module.exports.desc = 'Copy a mixin from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('mixin-name', {
    describe: 'The name of the mixin to copy',
  })
  yargs.positional('addon-name', {
    describe: 'The name of the addon folder to copy to',
  })

  yargs.option('mixin-folder', {
        alias: 'f',
        demandOption: false,
    describe: 'The name of the mixin folder if it is namespaced within app/helpers',
        type: 'string'
    })
};

module.exports.handler = async function handler(options) {

const fs = require('fs');
const fse = require('fs-extra');
const { log, error, ok, warning } = require('../utils/logging');

const mixinPath = 'app/mixins';
const packagePath = 'packages/engines';

const {mixinFolder, mixinName, addonName, dryRun} = options;

// Moving mixin.js
log('Moving mixin.js');
log('---------------');
  const sourcemixin = mixinFolder ? 
    `${mixinPath}/${mixinFolder}/${mixinName}.js`
    : `${mixinPath}/${mixinName}.js`;
const destmixin = `${packagePath}/${addonName}/addon/mixins/${mixinName}.js`;

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
const sourceTest = mixinFolder ? 
`tests/unit/mixins/${mixinFolder}/${mixinName}-test.js`
: `tests/unit/mixins/${mixinName}-test.js`;
const destTest = `${packagePath}/${addonName}/tests/unit/mixins/${mixinName}-test.js`;

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
};
