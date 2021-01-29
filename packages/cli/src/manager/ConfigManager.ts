import type { ObjectSchema } from 'joi'
import type { ProjectConfig } from '../types'
import type { ConfigValidator } from '../utils'
import type { IPathManager } from './PathManager'
import { loadModule, error, validate } from '../utils'
import { projectConfigValidator, defaultProjectConfig } from '../options'

class ConfigManager {
  private PathManager: IPathManager

  private finalConfig: ProjectConfig = {}

  private configValidator: ConfigValidator = {}

  registerConfigValidator<T = Record<string, any>>(
    name: string,
    validator: ObjectSchema<T>
  ): void {
    this.configValidator[name] = validator
  }

  get projectConfig(): ProjectConfig {
    return this.finalConfig
  }

  constructor(pathManager: IPathManager) {
    this.PathManager = pathManager
  }

  async loadUserConfig(): Promise<void> {
    // 1. load userConfig
    let userConfig: ProjectConfig
    const [err, configContent] = await loadModule<ProjectConfig>(
      this.PathManager.userConfigPath
    )
    userConfig = configContent
    if (err) {
      userConfig = {}
    }

    userConfig = Object.assign(
      {},
      defaultProjectConfig(this.PathManager.ctxPath),
      configContent
    )
    // valid
    projectConfigValidator(userConfig, (msg) => {
      error(`xus.config.js invalid ${msg}`)
    })

    this.finalConfig = userConfig
  }

  validatePluginConfig(): void {
    // valid plugin config
    const { pluginOps = null } = this.projectConfig
    if (!pluginOps) return
    for (const configName in this.configValidator) {
      const config = pluginOps[configName] || null
      if (!config) continue
      const validator = this.configValidator[configName]
      validate(config, validator, (msg) => {
        error(`xus.config.js invalid ${msg}`)
        process.exit(1)
      })
    }
  }

  // for plugin
  async loadConfig<T = any>(configPath: string): Promise<T | null> {
    const [err, configContent] = await loadModule<T>(configPath)
    if (err) return null
    return configContent || null
  }
}

export type IConfigManager = InstanceType<typeof ConfigManager>

export default ConfigManager
