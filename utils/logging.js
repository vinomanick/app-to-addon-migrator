const chalk = require('chalk');
const log = console.log;

const info = (msg) => log(chalk.blue(msg));
const error = (msg) => log(chalk.red(msg));
const ok = (msg) => log(chalk.green(msg));
const warning = (msg) => log(chalk.yellow(msg));

module.exports = {
  log,
  info,
  error,
  ok,
  warning,
};
