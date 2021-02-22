import type {
  IPluginAPI as IPluginAPIBase,
  IPathManager,
  IConfigManager,
  IEnvManager,
  IPluginManager
} from '@xus/core'
import type { IConfig } from './create'

type noopFn = () => any

export interface IPluginAPI extends IPluginAPIBase {
  // service lifycycle
  onPluginReady: noopFn
  onRunCmd: noopFn

  // path manager
  cwd: IPathManager['cwd']
  cwdPkg: IPathManager['cwdPkg']
  userConfigPath: IPathManager['userConfigPath']
  getPathBasedOnCtx: IPathManager['getPathBasedOnCtx']

  // env manager
  mode: IEnvManager['mode']
  babelEnv: IEnvManager['babelEnv']
  getEnv: IEnvManager['getEnv']
  setEnv: IEnvManager['setEnv']
  getCliEnv: IEnvManager['getCliEnv']
  setCliEnv: IEnvManager['setCliEnv']

  // config manager
  projectConfig: IConfig
  cwdPkgJson: IConfigManager['cwdPkgJson']
  loadConfig: IConfigManager['loadConfig']

  // plugin manager
  skipPlugin: IPluginManager['skipPlugin']
}
