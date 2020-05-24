const { join } = require('path');
const { lstatSync, readdirSync } = require('fs');
const fuzzy = require('fuzzy');

const isDirectory = (source) => lstatSync(source).isDirectory();
const getDirectories = (source) => {
  return readdirSync(source)
    .map((name) => join(source, name))
    .filter(isDirectory);
};

const dest = [...getDirectories('packages/addons'), ...getDirectories('packages/engines')];

module.exports = function (answers, input) {
  input = input || '';
  return new Promise(function (resolve) {
    setTimeout(function () {
      var fuzzyResult = fuzzy.filter(input, dest);
      resolve(
        fuzzyResult.map(function (el) {
          return el.original;
        })
      );
    }, 100);
  });
};
