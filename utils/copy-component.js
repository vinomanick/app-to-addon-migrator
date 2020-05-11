
'use strict';

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const { log, error, ok, warning } = require('./logging');

module.exports = function (options) {

  const componentPath = 'app/components';
  const {componentFolder, componentName, destination, dryRun, pods} = options;
  const packagePath = path.join('.', destination) || 'packages/engines';


  // Moving component.js
  // IMPORTANT NOTE: We're deliberately avoiding POD structure in engines
  // Hence, the components are moved appropriately splitting the js and hbs
  // from a single folder
  log('Moving component.js');
  log('---------------');
  let sourceComponent;

  if(pods) {

    sourceComponent = componentFolder ? `${componentPath}/${componentFolder}/${componentName}/component.js`
      : `${componentPath}/${componentName}/component.js`;
  } else {

    sourceComponent = componentFolder ? `${componentPath}/${componentFolder}/${componentName}.js`
      : `${componentPath}/${componentName}.js`;
  }

  const destComponent = `${packagePath}/addon/components/${componentName}.js`;

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

  let sourceTemplate;
  if(pods) {

    sourceTemplate = componentFolder ? 
`${componentPath}/${componentFolder}/${componentName}/template.hbs`
      : `${componentPath}/${componentName}/template.hbs`;
  } else {

    sourceTemplate = componentFolder ? 
`app/templates/components/${componentFolder}/${componentName}.hbs`
      : `app/templates/components/${componentName}.hbs`;
  }
  const destTemplate = `${packagePath}/addon/templates/components/${componentName}.hbs`;

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
  const sourceTest = componentFolder ? 
`tests/integration/components/${componentFolder}/${componentName}/component-test.js`
    : `tests/integration/components/${componentName}/component-test.js`;
  const destTest = `${packagePath}/tests/integration/components/${componentName}-test.js`;

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

  const appComponent = `${packagePath}/app/components/${componentName}.js`;
  const addonName = path.basename(destination);
  const appComponentContent = `export { default } from '${addonName}/components/${componentName}';`;
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
