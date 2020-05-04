'use strict';

module.exports.command = 'route [route-name] [addon-name]';

module.exports.desc = 'Copy a route with controller from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('route-name', {
    describe: 'The name of the route to copy',
  })
  yargs.positional('addon-name', {
    describe: 'The name of the addon folder to copy to',
  })

yargs.option('route-folder', {
        alias: 'f',
        demandOption: false,
    describe: 'The name of the route folder if it is namespaced within app/helpers',
        type: 'string'
    })
};

module.exports.handler = async function handler(options) {

const fs = require('fs');
const fse = require('fs-extra');

const { log, error, ok, warning } = require('../utils/logging');

const { routeName, addonName, routeFolder,dryRun } = options;

const routePath = 'app/routes/helpdesk';
const templatePath = 'app/templates/helpdesk';
const packagePath = 'packages/engines';
const testPath = 'tests/unit/routes/helpdesk';
const controllerPath = 'app/controllers/helpdesk';
const controllerTestPath = 'tests/unit/controllers/helpdesk';


// Moving route.js
log('Moving route.js');
log('---------------');
const sourceRoute = `${routePath}/${routeFolder}/${routeName}.js`;
const destRoute = `${packagePath}/${addonName}/addon/routes/${routeName}.js`;

log(sourceRoute);
log(destRoute);

if (!dryRun) {
  fse.copy(sourceRoute, destRoute)
    .then(() => {
      ok(`Success: Route ${routeName}.js moved`);
    })
    .catch((err) => error(err));
}

// Moving route template.hbs
log('\n\nMoving route template.hbs');
log('-------------------------');
const sourceTemplate = `${templatePath}/${routeFolder}/${routeName}.hbs`;

const destTemplate = `${packagePath}/${addonName}/addon/templates/${routeName}.hbs`;

log(sourceTemplate);
log(destTemplate);

if (!dryRun) {
  fse.copy(sourceTemplate, destTemplate)
    .then(() => {
      ok(`Success: Route template ${routeName}.hbs moved.`);
    })
    .catch((err) => error(err));
}

// Moving route tests
log('\n\nMoving route tests');
log('------------------');
const sourceTest = `${testPath}/${routeFolder}/${routeName}-test.js`;
const destTest = `${packagePath}/${addonName}/tests/unit/routes/${routeName}-test.js`;
log(sourceTest);
log(destTest);

if (!dryRun) {
  if (fs.existsSync(sourceTest)) {
    fse.copy(sourceTest, destTest)
      .then(() => {
        ok(`Success: Route test ${routeName}-test.js moved.`);
      })
      .catch((err) => error(err));
  } else {
    warning(`WARNING: There is no unit test for route ${routeName}.js`);
  }
}

// Create route assets to app folder in addon

log('\n\nCreating route assets in app folder ');
log('----------------------------------- ');

const appRoute = `${packagePath}/${addonName}/app/routes/${routeName}.js`;
const appRouteContent = `export { default } from '${addonName}/routes/${routeName}';`;
log(appRoute);
if (!dryRun) {
  fse.outputFile(appRoute, appRouteContent)
    .then(() => {
      ok(`Success: Route ${routeName}.js created in app`);
    })
    .catch((err) => {
      console.error(err);
    });
}

const appTemplate = `${packagePath}/${addonName}/app/templates/${routeName}.js`;
const appTemplateContent = `export { default } from '${addonName}/templates/${routeName}';`;
log(appTemplate);
if (!dryRun) {
  fse.outputFile(appTemplate, appTemplateContent)
    .then(() => {
      ok(`Success: Route template ${routeName}.js created in app`);
    })
    .catch((err) => {
      console.error(err);
    });
}

// Move the controllers
log('\nMoving controllers');
log('------------------');

const sourceController = `${controllerPath}/${routeFolder}/${routeName}.js`;
const destController = `${packagePath}/${addonName}/addon/controllers/${routeName}.js`;

log(sourceController);
log(destController);

if (!dryRun) {
  fse.copy(sourceController, destController)
    .then(() => {
      ok(`Success: Controller ${routeName}.js moved`);
    })
    .catch((err) => error(err));
}

// Create controller assets to app folder in addon

log('\nCreating controller assets in app folder ');
log('----------------------------------- ');

const appController = `${packagePath}/${addonName}/app/controllers/${routeName}.js`;
const controllerBody = `export { default } from '${addonName}/controllers/${routeName}';`;

log(appController);
if (!dryRun) {
  fse.outputFile(appController, controllerBody)
    .then(() => {
      ok(`Success: Controller ${routeName}.js created in app`);
    })
    .catch((err) => {
      console.error(err);
    });
}

// Moving controller tests
log('\nMoving controller tests');
log('------------------');
const sourceControllerTest = `${controllerTestPath}/${routeFolder}/${routeName}-test.js`;
const destControllerTest = `${packagePath}/${addonName}/tests/unit/controllers/${routeName}-test.js`;
log(sourceControllerTest);
log(destControllerTest);
if (!dryRun) {

  if (fs.existsSync(sourceTest)) {
    fse.copy(sourceControllerTest, destControllerTest)
      .then(() => {
        ok(`Success: Controller ${routeName}.js moved`);
      })
      .catch((err) => error(err));
  } else {
    warning(`WARNING: There were no tests for ${routeName} controller`);
  }
}

};
