#!/usr/bin/env node
'use strict';

const inquirer = require('inquirer');
const { moveAdapter } = require('../src/adapters');
const { moveComponent } = require('../src/components');
const { moveConstant } = require('../src/constants');
const { moveHelper } = require('../src/helpers');
const { moveMixin } = require('../src/mixins');
const { moveModel } = require('../src/models');
const { moveRoute } = require('../src/routes');
const { moveService } = require('../src/services');
const { moveStorage } = require('../src/storages');
const { moveUtil } = require('../src/utils');
const { moveValidator } = require('../src/validators');

const commandsPrompt = {
    type: 'list',
    name: 'command',
    message: 'Which one you want to move?',
    choices: [
      'adapter',
      'component',
      'constant',
      'helper',
      'mixin',
      'model',
      'route',
      'service',
      'storage',
      'util',
      'validator'
    ]
  };

function ask() {
  inquirer.prompt(commandsPrompt).then(answers => {

    switch(answers.command) {
    case 'adapter':
      moveAdapter();
      break;

    case 'component':
      moveComponent();
      break;

    case 'constant':
      moveConstant();
      break;

    case 'helper':
      moveHelper();
      break;

    case 'mixin':
      moveMixin();
      break;

    case 'model':
      moveModel();
      break;

    case 'route':
      moveRoute();
      break;

    case 'service':
      moveService();
      break;

    case 'storage':
      moveStorage();
      break;

    case 'util':
      moveUtil();
      break;

    case 'validator':
      moveValidator();
      break;

    default:
      break;
    }

    if (answers.askAgain) {
      ask();
    }

  });
}

ask();
