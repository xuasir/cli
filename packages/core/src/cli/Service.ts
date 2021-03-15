// types
import type {
  ICliServerOps,
  ICommand,
  IArgs,
  IRawArgs,
  IProjectConfig
} from '../types'
import { Logger, BabelRegister } from '@xus/cli-shared'
import { CliServiceStage, HookTypes } from '../enums'
import { CONFIG_FILES } from '../constants'
import {
  ConfigManager,
  EnvManager,
  PathManager,
  HookManager,
  PluginManager
} from '../manager'
import PluginAPI from './PluginAPI'

const logger = new Logger(`xus:core:cliService`)

export class CliService {
  protected initialized = false
  // lifecycle
  protected stage: CliServiceStage = CliServiceStage.uninstalled
  // metadata
  public commands: Record<string, ICommand> = {}
  public pluginMethods: Record<string, (...args: any[]) => any> = {}

  // base manager
  PathManager
  EnvManager
  ConfigManager
  PluginManager
  HookManager

  BabelRegister

  protected setStage(nextStage: CliServiceStage) {
    this.stage = nextStage
  }

  constructor(ops: ICliServerOps) {
    // DEBUG: log ops
    logger.debug(`cliServiceOps: `)
    logger.debug(ops)
    // 1. init manager
    this.setStage(CliServiceStage.initManager)
    this.BabelRegister = new BabelRegister()
    this.PathManager = new PathManager()
    this.EnvManager = new EnvManager({
      service: this,
      mode: ops.mode
    })
    this.ConfigManager = new ConfigManager({ service: this })
    this.PluginManager = new PluginManager({
      service: this,
      presets: ops.presets,
      plugins: ops.plugins
    })
    this.HookManager = new HookManager({ service: this })

    // DEBUG: log manager
    logger.debug(`PathManager: `)
    logger.debug(this.PathManager)
    logger.debug(`EnvManager: `)
    logger.debug(this.EnvManager)
    logger.debug(`ConfigManager: `)
    logger.debug(this.ConfigManager)
    logger.debug(`PluginManager: `)
    logger.debug(this.PluginManager)
    logger.debug(`HookManager: `)
    logger.debug(this.HookManager)

    // 2. init config (without plugin config)
    this.BabelRegister.setOnlyMap({
      key: 'xus:config',
      value: CONFIG_FILES
    })
    this.setStage(CliServiceStage.initUserConfig)
    this.ConfigManager.initUserConfig()

    // 3. resolve plugins and presets --> order plugins
    this.setStage(CliServiceStage.resolvePluginAndPresets)
    this.PluginManager.resolvePluginAndPreset()
  }

  // 启动 cli
  async setupCli(): Promise<void> {
    if (this.initialized) return
    this.initialized = true
    // 1. init plugin config
    this.setStage(CliServiceStage.initPluginConfig)
    this.ConfigManager.initPluginConfig()

    // 2. valid config
    this.setStage(CliServiceStage.validConfig)
    this.ConfigManager.validConfig()
    await this.HookManager.apply({
      name: 'configReady',
      type: HookTypes.event,
      args: this.ConfigManager.projectConfig
    })

    // 3. apply plugins
    this.setStage(CliServiceStage.applyPlugins)
    this.PluginManager.applyPlugins()
    // plugin register hooks ready
    await this.HookManager.apply({
      name: 'onSetuped',
      type: HookTypes.event,
      args: this.ConfigManager.projectConfig
    })
  }

  getPluginAPI(ops: { pluginName: string }) {
    const api = new PluginAPI({ ...ops, service: this })
    // register service lifycycle
    ;['onSetuped', 'onRunCmd'].forEach((methodName) => {
      api.registerMethod({ methodName, throwOnExist: false })
    })
    api.registerMethod({
      methodName: 'modifyProjectConfig',
      throwOnExist: false,
      fn: (config: IProjectConfig) => {
        this.ConfigManager.modifyProjectConfig(config)
      }
    })
    // register cmd args getter
    api.registerMethod({
      methodName: 'getCmdArgs',
      throwOnExist: false,
      fn: async () => {
        return await this.HookManager.apply({
          name: 'cmd:args',
          type: HookTypes.serial
        })
      }
    })
    // only proxy get
    const managerProxyMap = {
      ConfigManager: ['projectConfig', 'cwdPkgJson', 'loadConfig'],
      EnvManager: [
        'mode',
        'babelEnv',
        'getEnv',
        'setEnv',
        'getCliEnv',
        'setCliEnv'
      ],
      PathManager: [
        'cwd',
        'cwdPkg',
        'userConfigPath',
        'getPathBasedOnCtx',
        'getLernaPkgs'
      ],
      PluginManager: ['skipPlugin']
    }

    return new Proxy(api, {
      get: (target, key: string) => {
        // proxy to service
        if (['BabelRegister'].includes(key)) {
          return (this as any)[key]
        }
        // registerMethods
        if (this.pluginMethods[key]) {
          return this.pluginMethods[key].bind(api)
        }
        // proxy manager
        for (const manager in managerProxyMap) {
          const keys = (managerProxyMap as any)[manager] as string[]
          if (keys.includes(key)) {
            const ret = (this as any)[manager][key]
            return typeof ret === 'function'
              ? ret.bind((this as any)[manager])
              : ret
          }
        }
        // plugin api
        return (target as any)[key]
      }
    })
  }

  async run(commandName: string, args: IArgs, rawArgs: IRawArgs): Promise<any> {
    // 1. setup
    this.setStage(CliServiceStage.setupCli)
    await this.setupCli()

    logger.debug(`all commands: `)
    logger.debug(this.commands)
    logger.debug(`finding ${commandName} command`)

    // 2. get command task run
    let command: string | ICommand = commandName
    while (typeof command === 'string') {
      // handle of alias
      command = this.commands[commandName] || null
    }
    if (!command) {
      logger.error(`unknown command ${commandName}`)
      process.exit(1)
    }

    logger.debug(`ready to run command ${commandName}`)

    // 3. remove command
    args._.shift()
    rawArgs.shift()

    // 4. emit a start event
    this.setStage(CliServiceStage.runCmd)
    await this.HookManager.apply({
      name: 'onRunCmd',
      type: HookTypes.event
    })
    // for api
    this.HookManager.register({
      name: 'cmd:args',
      pluginName: 'xus:service',
      fn() {
        return { args, rawArgs }
      }
    })
    const { fn } = command
    return fn(args, rawArgs)
  }
}

export type ICliService = InstanceType<typeof CliService>
