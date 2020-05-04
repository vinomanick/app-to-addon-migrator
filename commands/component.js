'use strict';

module.exports.command = 'component [component-name] [addon-name]';

module.exports.desc = 'Copy a component from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('component-name', {
    describe: 'The name of the component to copy',
  })
  yargs.positional('addon-name', {
    describe: 'The name of the addon folder to copy to',
  })
  yargs.positional('component-folder', {
    describe: 'The name of the component folder if it is namespaced within app/components',
  });
};

module.exports.handler = async function handler(options) {


const fs = require('fs');
const fse = require('fs-extra');
const { log, error, ok, warning } = require('../utils/logging');

const componentPath = 'app/components';
const packagePath = 'packages/engines';

const {componentFolder, componentName, engineName, dryRun} = options;

// Moving component.js
// IMPORTANT NOTE: We're deliberately avoiding POD structure in engines
// Hence, the components are moved appropriately splitting the js and hbs
// from a single folder
log('Moving component.js');
log('---------------');
const sourceComponent = `${componentPath}/${componentFolder}/${componentName}/component.js`;
const destComponent = `${packagePath}/${engineName}/addon/components/${componentName}.js`;

log(sourceComponent);
log(destComponent);

if (!dryRun) {
  fse.copy(sourceComponent, destComponent)
    .then(() => {
      ok(`Success: Component ${componentName}.js moved`);
    })
    .catch((err) => error(err));
}

// Moving component template.hbs
log('\nMoving component template.hbs');
log('-------------------------');
const sourceTemplate = `${componentPath}/${componentFolder}/${componentName}/template.hbs`;
const destTemplate = `${packagePath}/${engineName}/addon/templates/components/${componentName}.hbs`;

log(sourceTemplate);
log(destTemplate);

if (!dryRun) {
  fse.copy(sourceTemplate, destTemplate)
    .then(() => {
      ok(`Success: Component Template ${componentName}.hbs moved`);
    })
    .catch((err) => error(err));
}

// Moving component tests
log('\nMoving component tests');
log('------------------');
const sourceTest = `tests/integration/components/${componentFolder}/${componentName}/component-test.js`;
const destTest = `${packagePath}/${engineName}/tests/integration/components/${componentName}-test.js`;

log(sourceTest);
log(destTest);
if (!dryRun) {
  if (fs.existsSync(sourceTest)) {
    fse.copy(sourceTest, destTest)
      .then(() => {
        ok(`Success: Component Test ${componentName}.hbs moved`);
      })
      .catch((err) => error(err));
  } else {
    warning(`WARNING: There are no integration tests for component ${componentName}`);
  }
}

// Create component assets to app folder in addon

log('\nCreating component assets in app folder ');
log('----------------------------------- ');

const appComponent = `${packagePath}/${engineName}/app/components/${componentName}.js`;
const appComponentContent = `export { default } from '${engineName}/components/${componentName}';`;
log(appComponent);
if (!dryRun) {
  fse.outputFile(appComponent, appComponentContent)
    .then(() => {
      ok(`Success: Component ${componentName}.js created in app`);
    })
    .catch((err) => {
      console.error(err);
    });
}

};
