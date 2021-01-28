import { ProjectConfig } from '../types'
import { loadModule } from '@xus/cli-shared-utils'
import { IPathManager } from './PathManager'

class ConfigManager {
  private PathManager: IPathManager

  private finalConfig: ProjectConfig = {}

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
    if (err) {
      userConfig = {}
    }
    userConfig = configContent
    // 2. merge default config
    // 3. valid

    this.finalConfig = userConfig
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
