#!/usr/bin/env node
import {program} from 'commander';
import create from './commands/create'
import initialize from './commands/initialize'

program
    .command('create')
    .description('Setup access key and create the flags in LaunchDarkly')
    .action(create)

program
    .command('initialize')
    .description('Setup client ID in environment file')
    .action(initialize)

program.parse()