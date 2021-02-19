import type { Command, Commands, IPluginAPI, Args } from '@xus/cli'
import chalk from 'chalk'
import { getPadLength } from './pad'

export default function (api: IPluginAPI): void {
  api.registerCommand('help', (args: Args) => {
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

function logAll(commads: Commands) {
  console.info(
    `\n  usage: ${chalk.green(`xus-cli <command> [options]`)}` + `\n  Commands:`
  )
  const padLen = getPadLength(commads)
  for (const name in commads) {
    if (name !== 'help') {
      const ops = commads[name].ops
      console.info(`\n    ${chalk.blue(name.padEnd(padLen))}${ops?.desc || ''}`)
    }
  }
  console.info(
    `\n  run ${chalk.green(`xus-cli help [command]`)}` +
      `\n  for detail information of specific command`
  )
}

function logPointCommand(name: string, commad: Command) {
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
