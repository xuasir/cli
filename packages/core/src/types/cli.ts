import type { IPlugin, IPreset } from './plugin'

// cli server ops
export type ICliServerOps = {
  ctxPath: string
  mode: string
  presets?: IPreset[]
  plugins?: IPlugin[]
}

export interface IPackage {
  name?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  [key: string]: any
}
