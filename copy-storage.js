#!/usr/bin/env node

const argv  =  require('yargs')
  .usage('Usage: $0 [storage-name] [engine-name] [storage-folder] --dry-run')
  .demand(2)
  .alias('d', 'dry-run')
  .argv;

const fse = require('fs-extra');
const { log,  error, ok } = require('./logging');

const { dryRun } = argv;
const storagePath = 'app/storages';
const packagePath = 'packages/engines';

const [storageName, engineName, storageFolder] = argv._;

// Moving storage.js
log('Moving storage.js');
log('---------------');
const sourcestorage = storageFolder ? `${storagePath}/${storageFolder}/${storageName}.js`
  : `${storagePath}/${storageName}.js`;
const deststorage = `${packagePath}/${engineName}/app/storages/${storageName}.js`;

log(sourcestorage);
log(deststorage);

if (!dryRun) {
  fse.copy(sourcestorage, deststorage)
    .then(() => {
      ok(`Success: storage ${storageName}.js copied`);
    })
    .catch((err) => error(err));
}

