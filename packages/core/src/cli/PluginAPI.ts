import type { ICommandFn, ICommandOps, IHook, IHookApplyOps } from '../types'
import type { ICliService } from './Service'
import { Logger } from '@xus/cli-shared'

type IPluginAPIOps = {
  pluginName: string
  service: ICliService
}

type IRegisterMethodOps = {
  methodName: string
  throwOnExist?: boolean
  fn?: (...args: any[]) => any
}

class PluginAPI {
  private pluginName: string
  private service: ICliService
  logger

  constructor(ops: IPluginAPIOps) {
    this.pluginName = ops.pluginName
    this.service = ops.service
    this.logger = new Logger(`xus:plugin:${ops.pluginName}`)
  }
  // proxy hook manager
  registerHook(hook: IHook) {
    this.service.HookManager.register(hook)
  }
  async applyHook(ops: IHookApplyOps) {
    await this.service.HookManager.apply(ops)
  }

  get commands() {
    return this.service.commands
  }

  registerCommand(name: string, fn: ICommandFn): void
  registerCommand(name: string, ops: ICommandOps, fn: ICommandFn): void
  registerCommand(name: string, ops: any, fn?: any): void {
    if (typeof ops === 'function') {
      fn = ops
      ops = null
    }

    this.service.commands[name] = {
      pluginName: this.pluginName,
      fn,
      ops
    }

    // register alias
    if (ops?.alias) {
      Object.keys(ops.alias).forEach((a) => {
        this.service.commands[a] = ops.alias[a]
      })
    }
  }

  // can register a method or a eventhook
  registerMethod(ops: IRegisterMethodOps) {
    const { methodName, throwOnExist = true } = ops
    if (this.service.pluginMethods[methodName]) {
      if (throwOnExist) {
        throw new Error(
          `method ${methodName} is already exist, register method fialed`
        )
      }
      return
    }

    this.service.pluginMethods[methodName] =
      ops?.fn ||
      // point this to caller
      function (fn: Omit<IHook, 'name' | 'pluginName'> | IHook['fn']) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.registerHook({
          name: methodName,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          pluginName: this.pluginName,
          ...(typeof fn === 'function' ? { fn } : fn)
        })
      }
  }
}

export type IPluginAPI = InstanceType<typeof PluginAPI>

export default PluginAPI
