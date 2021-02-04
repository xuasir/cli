import type { CommandFn, CommandOps } from './types'
import type { CliInstance } from './Cli'
import type { ObjectSchema } from 'joi'

class PluginAPI {
  id: string
  private service: CliInstance

  constructor(id: string, service: CliInstance) {
    this.id = id
    this.service = service
  }

  get PathManager() {
    return this.service.PathManager
  }

  get EnvManager() {
    return this.service.EnvManager
  }

  get ConfigManager() {
    return this.service.ConfigManager
  }

  get RollupManager() {
    return this.service.RollupManager
  }

  get commands() {
    return this.service.commands
  }

  registerCommand(name: string, fn: CommandFn): void
  registerCommand(name: string, ops: CommandOps, fn: CommandFn): void
  registerCommand(name: string, ops: any, fn?: any): void {
    if (typeof ops === 'function') {
      fn = ops
      ops = null
    }

    this.service.commands[name] = {
      fn,
      ops
    }
  }

  registerConfigValidator<T = Record<string, any>>(
    pluginConfigName: string,
    schema: ObjectSchema<T>
  ): void {
    this.ConfigManager.$addConfigValidator<T>(pluginConfigName, schema)
  }

  registerBundler(bundler: 'rollup' | 'gulp' | 'webpack', bunder: any) {
    switch (bundler) {
      case 'rollup':
        this.service.RollupManager = bunder
        break
    }
  }
}

export type IPluginAPI = InstanceType<typeof PluginAPI>

export default PluginAPI
