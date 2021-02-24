import type { IProjectConfig, IPluginConfig, IPackage } from '../types'
import type { ICliService } from '../cli/Service'
import { Logger, loadModule, deepmerge } from '@xus/cli-shared'
import { projectConfigValidator, defaultProjectConfig } from '../config'

type IProjectConfigPartial = Partial<IProjectConfig>

type IConfigManagerOps = {
  service: ICliService
}

const logger = new Logger(`xus:core:configManager`)
export class ConfigManager {
  private service: ICliService

  private isSetup = false
  private finalConfig!: IProjectConfig
  private pkgJson

  private pluginConfigs = new Map<string, IPluginConfig>()
  private pluginValidators = new Map<string, IPluginConfig['validator']>()
  private pluginDefaults: Record<string, any> = {}

  constructor(ops: IConfigManagerOps) {
    this.service = ops.service
    this.pkgJson = this.resolvePkg()
  }

  private resolvePkg(): IPackage {
    try {
      return require(this.service.PathManager.cwdPkg)
    } catch (e) {
      return {}
    }
  }

  // for service call
  initUserConfig() {
    if (this.isSetup) return
    this.isSetup = true

    this.finalConfig = deepmerge(
      defaultProjectConfig({
        mode: this.service.EnvManager.mode
      }),
      this.loadUserConfig()
    )

    logger.debug(`user config: `)
    logger.debug(this.finalConfig)
  }

  initPluginConfig() {
    this.finalConfig = deepmerge(
      {
        ...this.pluginConfigs
      },
      this.finalConfig
    )

    logger.debug(`final config`)
    logger.debug(this.finalConfig)
  }

  private loadUserConfig() {
    // 1. load userConfig
    const path = this.service.PathManager.userConfigPath
    const userConfig = path
      ? loadModule<IProjectConfigPartial>(path, (err) => {
          logger.error(`user config load failed, ${err}`)
        })
      : {}

    logger.debug(`user config: `)
    logger.debug(userConfig)

    // TODO: watch config change
    return userConfig
  }

  validConfig() {
    // valid project
    projectConfigValidator(this.finalConfig, (msg) => {
      logger.error(`project config invalid ${msg}`)
      process.exit(1)
    })

    // valid plugin config
    for (const [pluginName, pluginValidator] of this.pluginValidators) {
      if (pluginName in this.finalConfig) {
        pluginValidator!(this.finalConfig[pluginName], (msg) => {
          logger.error(`project config invalid ${msg}`)
          process.exit(1)
        })
      }
    }
    logger.debug(`valid config success`)
  }

  // for plugin api
  get projectConfig() {
    return this.finalConfig
  }

  get cwdPkgJson() {
    return this.pkgJson
  }

  registerPluginConfig(pluginName: string, pluginConfig: IPluginConfig): void {
    // TODO: do some valid
    this.pluginConfigs.set(pluginName, pluginConfig)
    // split plugin config
    if (pluginConfig.default) {
      this.pluginDefaults[pluginName] = pluginConfig.default()
    }
    if (pluginConfig.validator) {
      this.pluginValidators.set(pluginName, pluginConfig.validator)
    }
  }

  getConfigOpsByPluginName(pluginName: string) {
    return this.pluginConfigs.get(pluginName)
  }

  // for plugin api
  loadConfig<T = any>(configPath: string, onError: (err: any) => void): T {
    const configContent = loadModule<T>(configPath, onError)
    return configContent
  }
}

export type IConfigManager = InstanceType<typeof ConfigManager>
