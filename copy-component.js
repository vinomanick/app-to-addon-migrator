#!/usr/bin/env node

const argv  =  require('yargs')
  .usage('Usage: $0 [component-folder] [component-name] [engine-name] --dry-run')
  .demand(3)
  .alias('d', 'dry-run')
  .argv;

const fs = require('fs');
const fse = require('fs-extra');
const { log, error, ok, warning } = require('./logging');

const { dryRun } = argv;
const componentPath = 'app/components';
const packagePath = 'packages/engines';

const [componentFolder, componentName, engineName] = argv._;

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

