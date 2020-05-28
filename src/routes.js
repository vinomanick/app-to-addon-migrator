const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const route = require('./commands/route');

const walkSync = require('walk-sync');
const searchDest = require('./utils/search-dest');

module.exports.moveRoute = function moveRoute() {
  const routes = walkSync('app/routes', { directories: false }).map((a) => a.replace('.js', ''));

  inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

  function searchRoutes(answers, input) {
    input = input || '';
    return new Promise(function (resolve) {
      setTimeout(function () {
        var fuzzyResult = fuzzy.filter(input, routes);
        resolve(
          fuzzyResult.map(function (el) {
            return el.original;
          })
        );
      }, 100);
    });
  }

  const routePrompt = [
    {
      type: 'autocomplete',
      name: 'routeName',
      message: 'Enter the route name:',
      source: searchRoutes,
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

  inquirer.prompt(routePrompt).then((answers) => {
    route.handler(answers);
  });
};
