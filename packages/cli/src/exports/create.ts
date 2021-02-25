import type { IPlugin as IPluginBase, IProjectConfig } from '@xus/core'
import type { ILibBuildConfig } from '@xus/preset-built-in'
import type { IPluginAPI } from './pluginAPI'

export interface IConfig extends Partial<IProjectConfig> {
  libBuild: Partial<ILibBuildConfig>
}

export type IPlugin = IPluginBase<(api: IPluginAPI) => void>

export interface IPreset {
  plugins: IPlugin[]
}

export const createPlugin = (plugin: IPlugin) => plugin
export const createPreset = (preset: IPreset) => preset

export const defineConfig = (config: IConfig) => config
