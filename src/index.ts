#!/usr/bin/env ts-node
import {program} from 'commander';
import create from './commands/create'
import initialize from './commands/initialize'

program
    .command('create')
    .description('Create the flags in LaunchDarkly')
    .action(create)

program
    .command('initialize')
    .description('Setup access key in environment file')
    .action(initialize)

program.parse()