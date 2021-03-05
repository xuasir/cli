import type { IPlugin as IPluginBase, IProjectConfig } from '@xus/core'
import type {
  ILibBuildConfig,
  ILintConfig,
  IChangelogConfig,
  IReleaseConfig
} from '@xus/preset-built-in'
import type { IPluginAPI } from './pluginAPI'

export interface IConfig extends IProjectConfig {
  libBuild: ILibBuildConfig
  lint: Partial<ILintConfig>
  changelog: Partial<IChangelogConfig>
  release: Partial<IReleaseConfig>
}

export type IPlugin = IPluginBase<(api: IPluginAPI) => void>

export interface IPreset {
  plugins: IPlugin[]
}

export const createPlugin = (plugin: IPlugin) => plugin
export const createPreset = (preset: IPreset) => preset

export const defineConfig = (config: Partial<IConfig>) => config
