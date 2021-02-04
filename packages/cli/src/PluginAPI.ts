import type { CommandFn, CommandOps, Commands } from './types'
import type { IRollupManager } from '@xus/cli-plugin-bundler-rollup'
import type { IConfigManager } from './manager/ConfigManager'
import type { IEnvManager } from './manager/EnvManager'
import type { IPathManager } from './manager/PathManager'
import type { CliInstance } from './Cli'
import type { ObjectSchema } from 'joi'

class PluginAPI {
  id: string
  private service: CliInstance

  constructor(id: string, service: CliInstance) {
    this.id = id
    this.service = service
  }

  get PathManager(): IPathManager {
    return this.service.PathManager
  }

  get EnvManager(): IEnvManager {
    return this.service.EnvManager
  }

  get ConfigManager(): IConfigManager {
    return this.service.ConfigManager
  }

  get RollupManager(): IRollupManager {
    return this.service.RollupManager
  }

  get commands(): Commands {
    return this.service.commands
  }

  registerCommand(name: string, fn: CommandFn): void
  registerCommand(name: string, ops: CommandOps, fn: CommandFn): void
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
