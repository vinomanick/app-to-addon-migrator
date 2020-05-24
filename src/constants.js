const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const constant = require('../commands/constant');

const walkSync = require('walk-sync');

const searchDest = require('../utils/search-dest');

module.exports.moveConstant = function moveConstant() {
  const constants = walkSync('app/constants', { directories: false }).map((a) => a.replace('.js', ''));

  inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

  function searchConstants(answers, input) {
    input = input || '';
    return new Promise(function (resolve) {
      setTimeout(function () {
        var fuzzyResult = fuzzy.filter(input, constants);
        resolve(
          fuzzyResult.map(function (el) {
            return el.original;
          })
        );
      }, 100);
    });
  }

  const constantPrompt = [
    {
      type: 'autocomplete',
      name: 'constantName',
      message: 'Enter the constant name:',
      source: searchConstants,
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

  inquirer.prompt(constantPrompt).then((answers) => {
    constant.handler(answers);
  });
};
