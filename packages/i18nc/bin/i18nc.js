#!/usr/bin/env node

'use strict';

process.title = 'i18nc';

const argv = process.argv.slice();
if (argv.length < 3) argv.push('--help');

require('./commander').parse(argv);
