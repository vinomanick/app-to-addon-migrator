const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const helper = require('./commands/helper');

const walkSync = require('walk-sync');
const searchDest = require('./utils/search-dest');

module.exports.moveHelper = function moveHelper() {
  const helpers = walkSync('app/helpers').map((a) => a.replace('.js', ''));

  inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

  function searchHelpers(answers, input) {
    input = input || '';
    return new Promise(function (resolve) {
      setTimeout(function () {
        var fuzzyResult = fuzzy.filter(input, helpers);
        resolve(
          fuzzyResult.map(function (el) {
            return el.original;
          })
        );
      }, 100);
    });
  }

  const helperPrompt = [
    {
      type: 'autocomplete',
      name: 'helperName',
      message: 'Enter the helper name:',
      source: searchHelpers,
    },
    {
      type: 'autocomplete',
      name: 'destination',
      message: 'Enter the destination addon path:',
      source: searchDest,
    },
    {
      type: 'input',
      name: 'helperFolder',
      message: 'Enter the source folder (default: app/helpers):',
    },
    {
      type: 'confirm',
      name: 'dryRun',
      message: 'Dry Run? (default: yes)',
      default: true,
    },
  ];

  inquirer.prompt(helperPrompt).then((answers) => {
    helper.handler(answers);
  });
};
