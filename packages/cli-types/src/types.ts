import {
  IPlugin as IPluginBase,
  IFastHookRegister,
  IArgs,
  IRawArgs,
  IPluginAPI as IPluginAPIBase,
  IPathManager,
  IConfigManager,
  IEnvManager,
  IPluginManager,
  IProjectConfig
} from '@xus/core'
import type { IBabelRegister, IRunCmdMessage } from '@xus/cli-shared'
// preset api
import type { IRollupChain, IRollupChainConfig } from '@xus/rollup-chain'
import webpackChain from 'webpack-chain'
import { TransformOptions } from 'esbuild'

// Hooks Types
// type IEvent = any
// type ISerial = any
// type IParallel = any
// type IAdd = any

// IPluginAPI
type noopFn = () => any

export interface IPluginAPI extends IPluginAPIBase {
  // service api
  BabelRegister: IBabelRegister
  // service lifycycle
  onSetuped: IFastHookRegister<(config: IConfig) => void>
  onRunCmd: noopFn
  getCmdArgs: () => { args: IArgs; rawArgs: IRawArgs }
  modifyProjectConfig: (config: IConfig) => void

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

  // rollup
  modifyRollupConfig: IFastHookRegister<(rc: IRollupChain) => IRollupChain>
  getRollupConfig: () => Promise<IRollupChainConfig>
  // webpack
  modifyWebpackConfig: IFastHookRegister<(wc: webpackChain) => webpackChain>
  getWebpackConfig: () => Promise<any>
}

// IConfig
export interface IConfig extends IProjectConfig {
  libBuild: {
    libName: string
    // transform: 'esbuild' | 'babel'
    minify: false | 'esbuild' | 'terser'
    target: 'esnext' | TransformOptions['target']
    formats: ('esm' | 'cjs' | 'iife' | 'umd')[]
    rollTypes: boolean
    sourcemap: boolean
    alwaysEmptyDistDir: boolean

    // lerna mode
    pkgsOrder: string[]

    // insider
    rollupChain: (rc: IRollupChain) => IRollupChain
  }
  lint: {
    eslint:
      | boolean
      | {
          include?: string
          ext?: string[]
        }
    stylelint:
      | boolean
      | {
          include?: string[]
        }
  }
  changelog: {
    filename: string
    mainTemplate: string
    headerPartial: string
    commitPartial: string
  }
  release: {
    // before hooks for run lint test build...
    beforeRelease: {
      bin: string
      args: string[]
      message: IRunCmdMessage
    }[]
    // in lenra mode to ensure pkg publish order
    order: string[]
    branch: string
  }
}

// IPlugin
export type IPlugin = IPluginBase<(api: IPluginAPI) => void>

// IPreset
export interface IPreset {
  plugins: IPlugin[]
}
