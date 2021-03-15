import type { IPlugin, IPreset } from './plugin'

// cli server ops
export type ICliServerOps = {
  mode: string
  presets?: IPreset[]
  plugins?: IPlugin[]
}

export interface IPackage {
  name: string
  version: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  [key: string]: any
}
