// export types
import minimist from 'minimist'
import Cli from './Cli'
import { EnvEnum } from './utils/constants'
// 1. init cli
const cli = new Cli(process.env[EnvEnum.context] || process.cwd())
// 2. get args
const rawArgs = process.argv.slice(2)
const args = minimist(rawArgs)
const commandName = args._[0]
// 3. run commander
cli.run(commandName, args, rawArgs).catch((err) => {
  console.log(err)
  process.exit(1)
})
