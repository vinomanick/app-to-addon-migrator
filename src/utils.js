const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const util = require('../commands/util');

const walkSync = require('walk-sync');
const searchDest = require('../utils/search-dest');

module.exports.moveUtil = function moveUtil() {
  const utils = walkSync('app/utils', { directories: false }).map((a) => a.replace('.js', ''));

  inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

  function searchUtils(answers, input) {
    input = input || '';
    return new Promise(function (resolve) {
      setTimeout(function () {
        var fuzzyResult = fuzzy.filter(input, utils);
        resolve(
          fuzzyResult.map(function (el) {
            return el.original;
          })
        );
      }, 100);
    });
  }

  const utilPrompt = [
    {
      type: 'autocomplete',
      name: 'utilName',
      message: 'Enter the util name:',
      source: searchUtils,
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

  inquirer.prompt(utilPrompt).then((answers) => {
    util.handler(answers);
  });
};
