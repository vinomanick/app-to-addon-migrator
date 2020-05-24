const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const service = require('../commands/service');

const walkSync = require('walk-sync');
const searchDest = require('../utils/search-dest');

module.exports.moveService = function moveService() {
  const services = walkSync('app/services', { directories: false }).map((a) => a.replace('.js', ''));

  inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

  function searchServices(answers, input) {
    input = input || '';
    return new Promise(function (resolve) {
      setTimeout(function () {
        var fuzzyResult = fuzzy.filter(input, services);
        resolve(
          fuzzyResult.map(function (el) {
            return el.original;
          })
        );
      }, 100);
    });
  }

  const servicePrompt = [
    {
      type: 'autocomplete',
      name: 'serviceName',
      message: 'Enter the service name:',
      source: searchServices,
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

  inquirer.prompt(servicePrompt).then((answers) => {
    service.handler(answers);
  });
};
