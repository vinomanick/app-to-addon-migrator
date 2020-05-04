#!/usr/bin/env node

const argv  =  require('yargs')
  .usage('Usage: $0 [constant-name] [engine-name] [constant-folder] --dry-run')
  .demand(2)
  .alias('d', 'dry-run')
  .argv;

const fse = require('fs-extra');
const { log, error, ok } = require('./logging');

const { dryRun } = argv;
const constantPath = 'app/constants';
const packagePath = 'packages/engines';

const [constantName, engineName, constantFolder] = argv._;

// Moving constant.js
log('Moving constant.js');
log('---------------');
const sourceconstant = constantFolder ? `${constantPath}/${constantFolder}/${constantName}.js`
  : `${constantPath}/${constantName}.js`;
const destconstant = `${packagePath}/${engineName}/addon/constants/${constantName}.js`;

log(sourceconstant);
log(destconstant);

if (!dryRun) {
  fse.copy(sourceconstant, destconstant) //eslint-disable-line
    .then(() => {
      ok(`Success: constant ${constantName}.js copied`);
    })
    .catch((err) => error(err));
}
