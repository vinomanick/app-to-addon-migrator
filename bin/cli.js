#!/usr/bin/env node
'use strict';

require('yargs')
    .locale('en')
    .commandDir('../commands')
    .demandCommand()
    .help()
    .epilog('For more information, see https://github.com/rajasegar/app-to-addon-migrator')
    .alias('d', 'dry-run')
    .parse();
