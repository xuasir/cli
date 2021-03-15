import type { IArgs, IRawArgs } from '.'

// commands
export type ICommandFn<T extends Record<string, any> = IArgs> = (
  args: T,
  rawArgs: IRawArgs
) => any | Promise<any>
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
export interface ICommand<T extends IArgs = IArgs> {
  pluginName: string
  ops: ICommandOps | null
  fn: ICommandFn<T>
}
