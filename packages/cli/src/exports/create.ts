import type { IPlugin as IPluginBase, IProjectConfig } from '@xus/core'
import type { IPluginAPI } from './pluginAPI'

export type IConfig = IProjectConfig

export type IPlugin = IPluginBase<(api: IPluginAPI) => void>

export interface IPreset {
  plugins: IPlugin[]
}

export const createPlugin = (plugin: IPlugin) => plugin
export const createPreset = (preset: IPreset) => preset

export const defineConfig = (config: IConfig) => config
