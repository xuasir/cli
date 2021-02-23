import type { IPluginAPI } from '../cli/PluginAPI'
import type { IConfigSchemaValidator } from '@xus/cli-shared'

// plugins / presets
// api type override in @xus/cli
export type IPluginApply = (api: IPluginAPI) => void
type IEnforce = 'post' | 'pre'

export interface IPlugin<T extends (api: any) => void = IPluginApply> {
  // plugin only key
  name: string
  // plugin register method
  apply: T
  // optional
  // plugin order
  enforce?: IEnforce
  // plugin config
  config?: IPluginConfig
  // enableBy
}
export interface IPreset {
  plugins: IPlugin[]
}

export interface IPluginConfig<T = any> {
  default?: () => T
  validator?: IConfigSchemaValidator<T>
  // when config change how to do
  // onChange
}
