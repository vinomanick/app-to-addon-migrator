const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const validator = require('./commands/validator');

const walkSync = require('walk-sync');
const searchDest = require('./utils/search-dest');

module.exports.moveValidator = function moveValidator() {
  const validators = walkSync('app/validators', { directories: false }).map((a) =>
    a.replace('.js', '')
  );

  inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

  function searchValidators(answers, input) {
    input = input || '';
    return new Promise(function (resolve) {
      setTimeout(function () {
        var fuzzyResult = fuzzy.filter(input, validators);
        resolve(
          fuzzyResult.map(function (el) {
            return el.original;
          })
        );
      }, 100);
    });
  }

  const validatorPrompt = [
    {
      type: 'autocomplete',
      name: 'validatorName',
      message: 'Enter the validator name:',
      source: searchValidators,
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

  inquirer.prompt(validatorPrompt).then((answers) => {
    validator.handler(answers);
  });
};
