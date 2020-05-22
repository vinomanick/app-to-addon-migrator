'use strict'

module.exports.command = 'adapter [adapter-name] [destination]'
module.exports.desc = 'Copy an adapter from app to addon'

module.exports.builder = function builder (yargs) {
  yargs.positional('adapter-name', {
    describe: 'The name of the adapter to copy'
  })
  yargs.positional('destination', {
    describe: 'The relative path of the addon folder to copy to'
  })

  yargs.option('adapter-folder', {
    alias: 'f',
    demandOption: false,
    describe: 'The name of the helper folder if it is namespaced within app/helpers',
    type: 'string'
  })
}

module.exports.handler = async function handler (options) {
  const fs = require('fs')
  const fse = require('fs-extra')
  const path = require('path')
  const { log, error, ok, warning } = require('../utils/logging')

  const { adapterName, destination, adapterFolder, dryRun } = options
  log(adapterFolder)

  const adapterPath = 'app/adapters'
  const packagePath = path.join('.', destination) || 'packages/engines'

  // Moving adapter.js
  log('Moving adapter.js')
  log('---------------')
  const sourceadapter = adapterFolder ? `${adapterPath}/${adapterFolder}/${adapterName}.js`
    : `${adapterPath}/${adapterName}.js`
  const destadapter = `${packagePath}/addon/adapters/${adapterName}.js`

  log(sourceadapter)
  log(destadapter)

  if (!dryRun) {
    fse.copy(sourceadapter, destadapter)
      .then(() => {
        ok(`Success: Adapter ${adapterName}.js copied`)
      })
      .catch((err) => error(err))
  }

  // Moving adapter tests
  log('\nMoving adapter tests')
  log('------------------')
  const sourceTest = adapterFolder ? `tests/unit/adapters/${adapterFolder}/${adapterName}-test.js`
    : `tests/unit/adapters/${adapterName}-test.js`
  const destTest = `${packagePath}/tests/unit/adapters/${adapterName}-test.js`

  log(sourceTest)
  log(destTest)
  if (!dryRun) {
    if (fs.existsSync(sourceTest)) {
      fse.copy(sourceTest, destTest)
        .then(() => {
          ok(`Success: Adapter Test ${adapterName}.hbs copied`)
        })
        .catch((err) => error(err))
    } else {
      warning(`WARNING: There are no unit tests for adapter ${adapterName}`)
    }
  }

  // Create adapter assets to app folder in addon

  log('\nCreating adapter assets in app folder ')
  log('----------------------------------- ')

  const appadapter = `${packagePath}/app/adapters/${adapterName}.js`
  const addonName = path.basename(destination)
  const adapterBody = `export { default } from '${addonName}/adapters/${adapterName}';`
  log(appadapter)
  if (!dryRun) {
    fse.outputFile(appadapter, adapterBody)
      .then(() => {
        ok(`Success: Adapter ${adapterName}.js created in app`)
      })
      .catch((err) => {
        console.error(err)
      })
  }
}
