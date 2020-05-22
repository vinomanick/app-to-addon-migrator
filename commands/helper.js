'use strict'

module.exports.command = 'helper [helper-name] [destination]'

module.exports.desc = 'Copy a helper from app to addon'

module.exports.builder = function builder (yargs) {
  yargs.positional('helper-name', {
    describe: 'The name of the helper to copy'
  })
  yargs.positional('destination', {
    describe: 'The relative path of the addon folder to copy to'
  })

  yargs.option('helper-folder', {
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

  const helperPath = 'app/helpers'
  const { helperName, destination, helperFolder, dryRun } = options
  const packagePath = path.join('.', destination) || 'packages/engines'

  // Moving helper.js
  log('Moving helper.js')
  log('---------------')
  const sourcehelper = helperFolder ? `${helperPath}/${helperFolder}/${helperName}.js`
    : `${helperPath}/${helperName}.js`
  const desthelper = `${packagePath}/addon/helpers/${helperName}.js`

  log(sourcehelper)
  log(desthelper)

  if (!dryRun) {
    fse.copy(sourcehelper, desthelper)
      .then(() => {
        ok(`Success: helper ${helperName}.js copied`)
      })
      .catch((err) => error(err))
  }

  // Moving helper tests
  log('\nMoving helper tests')
  log('------------------')
  const sourceTest = helperFolder ? `tests/unit/helpers/${helperFolder}/${helperName}-test.js`
    : `tests/unit/helpers/${helperName}-test.js`
  const destTest = `${packagePath}/tests/unit/helpers/${helperName}-test.js`

  log(sourceTest)
  log(destTest)
  if (!dryRun) {
    if (fs.existsSync(sourceTest)) {
      fse.copy(sourceTest, destTest)
        .then(() => {
          ok(`Success: helper Test ${helperName}.hbs copied`)
        })
        .catch((err) => error(err))
    } else {
      warning(`WARNING: There are no unit tests for helper ${helperName}`)
    }
  }

  // Create helper assets to app folder in addon

  log('\nCreating helper assets in app folder ')
  log('----------------------------------- ')

  const appHelper = `${packagePath}/app/helpers/${helperName}.js`
  const addonName = path.basename(destination)
  const helperBody = `export { default } from '${addonName}/helpers/${helperName}';`
  log(appHelper)
  if (!dryRun) {
    fse.outputFile(appHelper, helperBody)
      .then(() => {
        ok(`Success: Helper ${helperName}.js created in app`)
      })
      .catch((err) => {
        console.error(err)
      })
  }
}
