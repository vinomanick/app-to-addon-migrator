#!/usr/bin/env node
'use strict';

require('yargs')
  .locale('en')
  .scriptName("atam")
  .commandDir('../commands')
  .demandCommand()
  .help()
  .usage('atam <command> <params> <options>')
  .epilog('For more information, see https://github.com/rajasegar/app-to-addon-migrator')
  .option('dry-run', {
    alias: 'd',
    demandOption: false,
    describe: 'Dry Run: Verify the movement without executing',
    type: 'boolean'
  })
  .parse();
