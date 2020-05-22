'use strict'

module.exports.command = 'model [model-name] [destination]'

module.exports.desc = 'Copy a model from app to addon'

module.exports.builder = function builder (yargs) {
  yargs.positional('model-name', {
    describe: 'The name of the model to copy'
  })
  yargs.positional('destination', {
    describe: 'The relative path of the addon folder to copy to'
  })

  yargs.option('model-folder', {
    alias: 'f',
    demandOption: false,
    describe: 'The name of the model folder if it is namespaced within app/helpers',
    type: 'string'
  })
}

module.exports.handler = async function handler (options) {
  const fs = require('fs')
  const fse = require('fs-extra')
  const path = require('path')
  const { log, error, ok, warning } = require('../utils/logging')

  const modelPath = 'app/models'

  const { modelName, destination, modelFolder, dryRun } = options
  const packagePath = path.join('.', destination) || 'packages/engines'

  // Moving model.js
  log('Moving model.js')
  log('---------------')
  const sourcemodel = modelFolder ? `${modelPath}/${modelFolder}/${modelName}.js`
    : `${modelPath}/${modelName}.js`
  const destmodel = `${packagePath}/addon/models/${modelName}.js`

  log(sourcemodel)
  log(destmodel)

  if (!dryRun) {
    fse.copy(sourcemodel, destmodel)
      .then(() => {
        ok(`Success: Model ${modelName}.js copied`)
      })
      .catch((err) => error(err))
  }

  // Moving model tests
  log('\nMoving model tests')
  log('------------------')
  const sourceTest = modelFolder ? `tests/unit/models/${modelFolder}/${modelName}-test.js`
    : `tests/unit/models/${modelName}-test.js`
  const destTest = `${packagePath}/tests/unit/models/${modelName}-test.js`

  log(sourceTest)
  log(destTest)
  if (!dryRun) {
    if (fs.existsSync(sourceTest)) {
      fse.copy(sourceTest, destTest)
        .then(() => {
          ok(`Success: Model Test ${modelName}.hbs copied`)
        })
        .catch((err) => error(err))
    } else {
      warning(`WARNING: There are no unit tests for model ${modelName}`)
    }
  }

  // Create model assets to app folder in addon

  log('\nCreating model assets in app folder ')
  log('----------------------------------- ')

  const appmodel = `${packagePath}/app/models/${modelName}.js`
  const addonName = path.basename(destination)
  const modelBody = `export { default } from '${addonName}/models/${modelName}';`
  log(appmodel)
  if (!dryRun) {
    fse.outputFile(appmodel, modelBody)
      .then(() => {
        ok(`Success: model ${modelName}.js created in app`)
      })
      .catch((err) => {
        console.error(err)
      })
  }
}
