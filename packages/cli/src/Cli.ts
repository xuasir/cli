// types
import { Commands, Args, RawArgs, Plugin } from './types'
import { error } from '@xus/cli-shared-utils'
import ConfigManager, { IConfigManager } from './manager/ConfigManager'
import PathManager, { IPathManager } from './manager/PathManager'
import EnvManager, { IEnvManager } from './manager/EnvManager'
import PluginAPI from './PluginAPI'
import { BuiltInPlugins } from './builtInPlugins'

class Cli {
  private initialized = false
  plugins: Plugin[] = []
  commands: Commands = {}
  // manager
  PathManager: IPathManager
  EnvManager: IEnvManager
  ConfigManager: IConfigManager

  constructor(context: string) {
    this.PathManager = new PathManager(context)
    this.EnvManager = new EnvManager(this.PathManager)
    this.ConfigManager = new ConfigManager(this.PathManager)

    this.plugins = this.resolvePlugins()
  }

  // 启动 cli
  async setupCli(): Promise<void> {
    if (this.initialized) return
    this.initialized = true
    // 1. load config
    await this.ConfigManager.loadUserConfig()
    // 2. apply plugins
    this.plugins.forEach(({ id, apply }) => {
      // some skip plugins ??
      apply(new PluginAPI(id, this), this.ConfigManager.projectConfig)
    })
  }

  resolvePlugins(): Plugin[] {
    // TODO: user install plugin
    return BuiltInPlugins
  }

  async run(commandName: string, args: Args, rawArgs: RawArgs): Promise<any> {
    // 1. setup
    await this.setupCli()

    // 2. get command task run
    const command = this.commands[commandName] || null
    if (!command) {
      error(`
        unknown command ${commandName}
      `)
      process.exit(1)
    }

    // remove command
    args._.shift()
    rawArgs.shift()

    const { fn } = command
    return fn(args, rawArgs)
  }
}

export type CliInstance = InstanceType<typeof Cli>

export default Cli
