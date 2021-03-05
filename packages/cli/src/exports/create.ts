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
  lint: ILintConfig
  changelog: IChangelogConfig
  release: IReleaseConfig
}

type IDeepPartial<T> = {
  [K in keyof T]?:
    | (T[K] extends Record<string, any> ? IDeepPartial<T[K]> : T[K])
    | undefined
}

export type IPlugin = IPluginBase<(api: IPluginAPI) => void>

export interface IPreset {
  plugins: IPlugin[]
}

export const createPlugin = (plugin: IPlugin) => plugin
export const createPreset = (preset: IPreset) => preset

export const defineConfig = (config: IDeepPartial<IConfig>) => config
