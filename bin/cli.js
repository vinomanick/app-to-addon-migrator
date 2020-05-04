#!/usr/bin/env node
'use strict';

require('yargs')
    .locale('en')
    .commandDir('../commands/global')
    .demandCommand()
    .help()
    .epilog('For more information, see https://github.com/rajasegar/app-to-addon-migrator')
    .parse();
