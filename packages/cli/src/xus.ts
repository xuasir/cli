// export types
import minimist from 'minimist'
import { XUSCliService } from './Service'
// 1. init cli
// 2. get args
const rawArgs = process.argv.slice(2)
const args = minimist(rawArgs)
const commandName = args._[0]
const ops = {
  mode: args?.mode || 'development'
}
const cli = new XUSCliService(ops)
// 3. run commander
cli.run(commandName, args, rawArgs).catch((err) => {
  console.log(`\n${err}`)
  process.exit(1)
})
