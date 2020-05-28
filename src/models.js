const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const model = require('./commands/model');

const walkSync = require('walk-sync');
const searchDest = require('./utils/search-dest');

module.exports.moveModel = function moveModel() {
  const models = walkSync('app/models').map((a) => a.replace('.js', ''));

  inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

  function searchModels(answers, input) {
    input = input || '';
    return new Promise(function (resolve) {
      setTimeout(function () {
        var fuzzyResult = fuzzy.filter(input, models);
        resolve(
          fuzzyResult.map(function (el) {
            return el.original;
          })
        );
      }, 100);
    });
  }

  const modelPrompt = [
    {
      type: 'autocomplete',
      name: 'modelName',
      message: 'Enter the model name:',
      source: searchModels,
    },
    {
      type: 'autocomplete',
      name: 'destination',
      message: 'Enter the destination addon path:',
      source: searchDest,
    },
    {
      type: 'confirm',
      name: 'dryRun',
      message: 'Dry Run? (default: yes)',
      default: true,
    },
  ];

  inquirer.prompt(modelPrompt).then((answers) => {
    model.handler(answers);
  });
};
