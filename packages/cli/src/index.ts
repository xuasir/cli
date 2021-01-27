#!/usr/bin/env node
import minimist from 'minimist'
import Cli from './Cli'
// collect builtIn plugins
// const plugins = []
// 1. init cli
const cli = new Cli(process.env.XUS_BUNDLE_CONTEXT || process.cwd())
// 2. get args
const rawArgs = process.argv.slice(2)
const args = minimist(rawArgs)
const commandName = args._[0]
// 3. run commander
cli.run(commandName, args, rawArgs).catch(() => {
  process.exit(1)
})
