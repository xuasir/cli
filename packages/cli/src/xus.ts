// export types
import minimist from 'minimist'
import { Cli } from '@xus/core'
// 1. init cli
const cli = new Cli(process.env.XUS_CLI_CONTEXT || process.cwd())
// 2. get args
const rawArgs = process.argv.slice(2)
const args = minimist(rawArgs)
const commandName = args._[0]
// 3. run commander
cli.run(commandName, args, rawArgs).catch((err) => {
  console.log(`\n${err}`)
  process.exit(1)
})
