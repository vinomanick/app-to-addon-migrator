const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const mixin = require('./commands/mixin');

const walkSync = require('walk-sync');
const searchDest = require('./utils/search-dest');

module.exports.moveMixin = function () {
  const mixins = walkSync('app/mixins', { directories: false }).map((a) => a.replace('.js', ''));

  inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

  function searchMixins(answers, input) {
    input = input || '';
    return new Promise(function (resolve) {
      setTimeout(function () {
        var fuzzyResult = fuzzy.filter(input, mixins);
        resolve(
          fuzzyResult.map(function (el) {
            return el.original;
          })
        );
      }, 100);
    });
  }

  const mixinPrompt = [
    {
      type: 'autocomplete',
      name: 'mixinName',
      message: 'Enter the mixin name:',
      source: searchMixins,
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

  inquirer.prompt(mixinPrompt).then((answers) => {
    mixin.handler(answers);
  });
};
