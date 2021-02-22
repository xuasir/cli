import type { IPlugin, IPreset } from '.'

export interface IProjectConfig {
  /**
   * @description cwd or point path
   */
  ctxPath: string
  /**
   * @description mode
   */
  mode: string
  /**
   * @description plugins
   */
  plugins?: IPlugin[]
  /**
   * @description plugins
   */
  presets?: IPreset[]

  // rest option
  [key: string]: any
}
