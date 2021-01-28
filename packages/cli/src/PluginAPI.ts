import { IConfigManager } from './manager/ConfigManager'
import { IEnvManager } from './manager/EnvManager'
import { CommandFn, CommandOps, Commands } from './types'
import { IPathManager } from './manager/PathManager'
import { CliInstance } from './Cli'

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

  get commands(): Commands {
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

  // registerConfigValidator(configName: string): void
}

export type IPluginAPI = InstanceType<typeof PluginAPI>

export default PluginAPI
