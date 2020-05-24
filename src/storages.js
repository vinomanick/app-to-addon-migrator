const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const storage = require('../commands/storage');

const walkSync = require('walk-sync');
const searchDest = require('../utils/search-dest');

module.exports.moveStorage = function moveStorage() {
  const storages = walkSync('app/storages', { directories: false }).map((a) =>
    a.replace('.js', '')
  );

  inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

  function searchStorages(answers, input) {
    input = input || '';
    return new Promise(function (resolve) {
      setTimeout(function () {
        var fuzzyResult = fuzzy.filter(input, storages);
        resolve(
          fuzzyResult.map(function (el) {
            return el.original;
          })
        );
      }, 100);
    });
  }

  const storagePrompt = [
    {
      type: 'autocomplete',
      name: 'storageName',
      message: 'Enter the storage name:',
      source: searchStorages,
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

  inquirer.prompt(storagePrompt).then((answers) => {
    storage.handler(answers);
  });
};
