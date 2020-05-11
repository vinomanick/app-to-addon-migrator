'use strict';

module.exports.command = 'routex [route-name] [destination]';

module.exports.desc = 'Copy a route and its dependent components from app to addon';

module.exports.builder = function builder(yargs) {
  yargs.positional('route-name', {
    describe: 'The name of the route to copy',
  })
  yargs.positional('destination', {
    describe: 'The relative path of the addon folder to copy to',
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
  const inquirer = require('inquirer');
  const fuzzy = require('fuzzy');
  const path = require('path');

  const { transform } = require('ember-template-recast');
  const { log, error, ok, warning } = require('../utils/logging');

  const copyComponent = require('../utils/copy-component');


  const { routeName, destination, routeFolder, dryRun } = options;
  const routePath = 'app/routes/helpdesk';
  const templatePath = 'app/templates/helpdesk';
  const packagePath = path.join('.', destination) || 'packages/engines';
  const testPath = 'tests/unit/routes/helpdesk';
  const controllerPath = 'app/controllers/helpdesk';
  const controllerTestPath = 'tests/unit/controllers/helpdesk';



  // Moving route.js
  log('Moving route.js');
  log('---------------');
  const sourceRoute = routeFolder ? 
    `${routePath}/${routeFolder}/${routeName}.js`
    : `${routePath}/${routeName}.js`;

  const sourceTemplate = routeFolder ? 
    `${templatePath}/${routeFolder}/${routeName}.hbs`
    : `${templatePath}/${routeName}.hbs`;

  let components = [];

  const ignoreList = [
    'action',
    'if',
    't',
    'component'
  ];

  const componentsFromAddon = [
    'ember-wormhole',
    'svg-jar',
    'power-select'
  ];

  const pods = true;

  function isValidComponent(name) {
    return !ignoreList.includes(name) && !name.includes('.') && !componentsFromAddon.includes(name);
  }

  fse.readFile(sourceTemplate, 'utf-8')
    .then((data) => {
      console.log(data);
      transform(data, () => {
        return  {
          BlockStatement(node) {
            if (isValidComponent(node.path.original)) {
              components.push(node.path.original);
            }
            return node;
          },

          MustacheStatement(node) {
            if (isValidComponent(node.path.original)) {
              components.push(node.path.original);
            }
            return node;
          }
        };
      });

      inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));
      inquirer.prompt([{
        type: 'checkbox-plus',
        name: 'components',
        message: 'Select [spacebar] components to copy/move:',
        pageSize: 10,
        highlight: true,
        searchable: true,
        source(answersSoFar, input) {

          input = input || '';

          return new Promise(function(resolve) {

            let fuzzyResult = fuzzy.filter(input, components);

            let data = fuzzyResult.map(function(element) {
              return element.original;
            });

            resolve(data);

          });

        }
      }]).then(function(answers) {

        console.log(answers.components);
        answers.components.forEach(component => {

          let _componentFolder = undefined;
          let _componentName = component;
          // component namespace is present
          if(component.includes('/')) {
            [_componentFolder, _componentName] = component.split('/');
          }
          let opts = {
            componentFolder: _componentFolder,
            componentName: _componentName,
            addonName,
            dryRun
          };

          copyComponent(opts);


        });

      });
    });
};
