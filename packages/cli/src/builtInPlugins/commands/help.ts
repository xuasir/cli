import { Commands, Command } from './../../types'
import { IPluginAPI } from '../../PluginAPI'
import { info } from '@xus/cli-shared-utils'
import chalk from 'chalk'

export default function (api: IPluginAPI): void {
  api.registerCommand('help', (args) => {
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
  info(`
    usage: xus-cli <command> [options]
    Commands: 

  `)
  for (const name in commads) {
    if (name !== 'help') {
      const ops = commads[name].ops
      info(`
        ${chalk.blue(name)}
        ${ops?.desc || ''}
      `)
    }
  }
  info(`
    run ${chalk.green(`xus-cli help [command]`)}
    for detail information of specific command
  `)
}

function logPointCommand(name: string, commad: Command) {
  if (!commad) {
    info(chalk.red(`\n  command "${name}" does not exist.`))
  } else {
    const { ops } = commad
    if (ops?.usage) {
      info(`
        Uasge: ${ops.usage}
      `)
    }
    if (ops?.options) {
      info(`
        Options: 
      `)
      for (const [flags, description] of Object.entries(ops.options)) {
        info(`    ${chalk.blue(flags)}:   ${description}`)
      }
    }
  }
  info('')
}
