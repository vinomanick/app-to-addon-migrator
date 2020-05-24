const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const adapter = require('../commands/adapter');

const walkSync = require('walk-sync');
const searchDest = require('../utils/search-dest');

module.exports.moveAdapter = function moveAdapter() {
  const adapters = walkSync('app/adapters', { directories: false }).map((a) => a.replace('.js', ''));

  inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

  function searchAdapters(answers, input) {
    input = input || '';
    return new Promise(function (resolve) {
      setTimeout(function () {
        var fuzzyResult = fuzzy.filter(input, adapters);
        resolve(
          fuzzyResult.map(function (el) {
            return el.original;
          })
        );
      }, 100);
    });
  }

  const adapterPrompt = [
    {
      type: 'autocomplete',
      name: 'adapterName',
      message: 'Enter the adapter name:',
      source: searchAdapters,
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

  inquirer.prompt(adapterPrompt).then((answers) => {
    adapter.handler(answers);
  });
};

