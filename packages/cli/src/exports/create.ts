import type { IPlugin as IPluginBase, IProjectConfig } from '@xus/core'
import type { IPluginAPI } from './pluginAPI'

export type IConfig = IProjectConfig

export interface IPlugin {
  name: IPluginBase['name']
  config?: IPluginBase['config']
  enforce?: IPluginBase['enforce']
  apply: (api: IPluginAPI) => void
}

export interface IPreset {
  plugins: IPlugin[]
}

export const createPlugin = (plugin: IPlugin) => plugin
export const createPreset = (preset: IPreset) => preset

export const defineConfig = (config: IConfig) => config
