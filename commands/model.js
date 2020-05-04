'use strict';

module.exports.command = 'model [model-name] [addon-name]';

module.exports.desc = 'Copy a model from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('model-name', {
    describe: 'The name of the model to copy',
  })
  yargs.positional('addon-name', {
    describe: 'The name of the addon folder to copy to',
  })
  yargs.positional('model-folder', {
    describe: 'The name of the model folder if it is namespaced within app/models',
  });
};

module.exports.handler = async function handler(options) {

const argv  =  require('yargs')
  .usage('Usage: $0 [model-name] [engine-name] [model-folder] --dry-run')
  .demand(2)
  .alias('d', 'dry-run')
  .argv;

const fs = require('fs');
const fse = require('fs-extra');
const { log, error, ok, warning } = require('../utils/logging');

const { dryRun } = argv;
const modelPath = 'app/models';
const packagePath = 'packages/engines';

const [modelName, engineName, modelFolder] = argv._;

// Moving model.js
log('Moving model.js');
log('---------------');
const sourcemodel = modelFolder ? `${modelPath}/${modelFolder}/${modelName}.js`
  : `${modelPath}/${modelName}.js`;
const destmodel = `${packagePath}/${engineName}/addon/models/${modelName}.js`;

log(sourcemodel);
log(destmodel);

if (!dryRun) {
  fse.copy(sourcemodel, destmodel)
    .then(() => {
      ok(`Success: Model ${modelName}.js copied`);
    })
    .catch((err) => error(err));
}

// Moving model tests
log('\nMoving model tests');
log('------------------');
const sourceTest = modelFolder ? `tests/unit/models/${modelFolder}/${modelName}-test.js`
  : `tests/unit/models/${modelName}-test.js`;
const destTest = `${packagePath}/${engineName}/tests/unit/models/${modelName}-test.js`;

log(sourceTest);
log(destTest);
if (!dryRun) {
  if (fs.existsSync(sourceTest)) {
    fse.copy(sourceTest, destTest)
      .then(() => {
        ok(`Success: Model Test ${modelName}.hbs copied`);
      })
      .catch((err) => error(err));
  } else {
    warning(`WARNING: There are no unit tests for model ${modelName}`);
  }
}

// Create model assets to app folder in addon

log('\nCreating model assets in app folder ');
log('----------------------------------- ');

const appmodel = `${packagePath}/${engineName}/app/models/${modelName}.js`;
const modelBody = `export { default } from '${engineName}/models/${modelName}';`;
log(appmodel);
if (!dryRun) {
  fse.outputFile(appmodel, modelBody)
    .then(() => {
      ok(`Success: model ${modelName}.js created in app`);
    })
    .catch((err) => {
      console.error(err);
    });
}
};
