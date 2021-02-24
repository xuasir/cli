import type {
  IPluginAPI as IPluginAPIBase,
  IPathManager,
  IConfigManager,
  IEnvManager,
  IPluginManager,
  IArgs,
  IRawArgs
} from '@xus/core'
import type { IConfig } from './create'
import { IBuildLibMethods } from '@xus/plugin-build-lib'
import { IBundlerRollupMethods } from '@xus/plugin-bundler-rollup'

type noopFn = () => any

export interface IPluginAPI extends IPluginAPIBase {
  // service lifycycle
  onPluginReady: noopFn
  onRunCmd: noopFn
  getCmdArgs: () => { args: IArgs; rawArgs: IRawArgs }

  // path manager
  cwd: IPathManager['cwd']
  cwdPkg: IPathManager['cwdPkg']
  userConfigPath: IPathManager['userConfigPath']
  getPathBasedOnCtx: IPathManager['getPathBasedOnCtx']
  getLernaPkgs: IPathManager['getLernaPkgs']

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

  // build lib plugin
  modifyLibBundler: IBuildLibMethods['modifyLibBundler']
  onLibBuildFailed: IBuildLibMethods['onLibBuildFailed']
  onLibBuildSucceed: IBuildLibMethods['onLibBuildSucceed']
  runLibBuild: IBuildLibMethods['runLibBuild']

  // bundler rollup plugin
  modifyRollupConfig: IBundlerRollupMethods['modifyRollupConfig']
}
