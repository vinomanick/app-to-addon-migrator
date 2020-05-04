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

yargs.option('component-folder', {
        alias: 'f',
        demandOption: false,
    describe: 'The name of the component folder if it is namespaced within app/helpers',
        type: 'string'
    })
};

module.exports.handler = async function handler(options) {


const fs = require('fs');
const fse = require('fs-extra');
const { log, error, ok, warning } = require('../utils/logging');
const copyComponent = require('../utils/copy-component');

const componentPath = 'app/components';
const packagePath = 'packages/engines';

const {componentFolder, componentName, addonName, dryRun} = options;

copyComponent(options);

};

