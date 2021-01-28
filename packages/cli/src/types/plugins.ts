import { ProjectConfig } from './config'
import { Args, RawArgs } from './args'
import { IPluginAPI } from '../PluginAPI'

export interface Plugin {
  id: string
  apply: (api: IPluginAPI, projectOps: ProjectConfig) => void
}

export type CommandFn = (args: Args, rawArgs?: RawArgs) => any | Promise<any>
export interface CommandOps {
  desc: string
  usage: string
  options: {
    [key: string]: string
  }
}

export interface Command {
  fn: CommandFn
  ops: CommandOps | null
}

export interface Commands {
  [key: string]: Command
}
