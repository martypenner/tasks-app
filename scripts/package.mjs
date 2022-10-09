#!/usr/bin/env zx

import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import 'zx/globals';
dotenv.config();

await $`pkg --compress GZip ${argv.debug ? '--debug' : ''} package.json`;
