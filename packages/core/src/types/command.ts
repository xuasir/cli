import type { IArgs, IRawArgs } from '.'

// commands
export type ICommandFn = (args: IArgs, rawArgs: IRawArgs) => any | Promise<any>
export interface ICommandOps {
  desc?: string
  usage?: string
  options?: {
    [key: string]: string
  }
  alias?: {
    [key: string]: string
  }
}
export interface ICommand {
  pluginName: string
  ops: ICommandOps | null
  fn: ICommandFn
}
