import {
  // types
  ICommand,
  IArgs,
  // usage
  chalk,
  createPlugin
} from '@xus/cli'

export default createPlugin({
  name: 'commandHelp',
  apply(api) {
    api.registerCommand('help', (args: IArgs) => {
      const commandName = args._[0]
      if (!commandName) {
        // log all
        logAll(api.commands)
      } else {
        // log point
        logPointCommand(commandName, api.commands[commandName])
      }
    })
  }
})

function logAll(commads: Record<string, ICommand>) {
  console.info(
    `\nusage: ${chalk.green(`xus-cli <command> [options]`)}` + `\nCommands:`
  )
  const padLen = getPadLength(commads)
  for (const name in commads) {
    if (name !== 'help') {
      const ops = commads[name].ops
      console.info(`\n  ${chalk.blue(name.padEnd(padLen))}${ops?.desc || ''}`)
    }
  }
  console.info(
    `\nrun ${chalk.green(`xus-cli help [command]`)}` +
      `\nfor detail information of specific command\n`
  )
}

function logPointCommand(name: string, commad: ICommand) {
  if (!commad) {
    console.info(chalk.red(`\n  command "${name}" does not exist.`))
  } else {
    const { ops } = commad
    console.info(`\nCommand: ${name}`)
    if (ops?.usage) {
      console.info(`\n  Uasge: ${ops.usage}`)
    }
    if (ops?.options) {
      console.info(`\n  Options: `)
      const padLen = getPadLength(ops.options)
      for (const [flags, description] of Object.entries(ops.options)) {
        console.info(
          `\n    ${chalk.blue(flags.padEnd(padLen))}:  ${description}`
        )
      }
    }
  }
  console.info('')
}

function getPadLength(obj: Record<string, any>): number {
  let longest = 10
  for (const name in obj) {
    if (name.length + 1 > longest) longest = name.length + 1
  }
  return longest
}
