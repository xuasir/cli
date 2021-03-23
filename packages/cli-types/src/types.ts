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
import type { IEsbuildRegister, IRunCmdMessage } from '@xus/cli-shared'
// preset api
import type { IRollupChain, IRollupChainConfig } from '@xus/rollup-chain'
import webpackChain from 'webpack-chain'
import { TransformOptions } from 'esbuild'
import * as Postcss from 'postcss'

// Hooks Types
// type IEvent = any
// type ISerial = any
// type IParallel = any
// type IAdd = any

// IPluginAPI
type noopFn = () => any

export interface IPluginAPI extends IPluginAPIBase {
  // service api
  EsbuildRegister: IEsbuildRegister
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
  modifyRollupConfig: IFastHookRegister<
    (rc: IRollupChain, arg?: any) => IRollupChain
  >
  getRollupConfig: (arg?: any) => Promise<IRollupChainConfig>
  // webpack
  modifyWebpackConfig: IFastHookRegister<
    (wc: webpackChain, arg?: any) => webpackChain
  >
  getWebpackConfig: (arg?: any) => Promise<any>
}

// IConfig

type ICmd = {
  bin: string
  args: string[]
  message: IRunCmdMessage
}
export interface IConfig extends IProjectConfig {
  libBuild: {
    libName: string
    target: 'esnext' | TransformOptions['target']
    formats: ('esm' | 'cjs' | 'iife' | 'umd')[]
    disableFormatPostfix: boolean
    rollTypes: boolean
    sourcemap: boolean
    minify: false | 'esbuild' | 'terser'
    alwaysEmptyDistDir: boolean
    css: {
      injectMode: false | 'script' | 'url'
      cssCodeSplit: boolean
      modules: {
        getJSON?: (
          cssFileName: string,
          json: Record<string, string>,
          outputFileName: string
        ) => void
        scopeBehaviour?: 'global' | 'local'
        globalModulePaths?: string[]
        generateScopedName?:
          | string
          | ((name: string, filename: string, css: string) => string)
        hashPrefix?: string
        /**
         * default: null
         */
        localsConvention?:
          | 'camelCase'
          | 'camelCaseOnly'
          | 'dashes'
          | 'dashesOnly'
          | null
      }
      postcss: Postcss.ProcessOptions & { plugins: Postcss.Plugin[] }
      preprocessor: Partial<Record<'sass' | 'less' | 'stylus', any>>
    }
    assets: {
      dirname: string
      inlineLimit: number
    }
    json: {
      exportMode: 'named' | 'stringify'
    }
    alias: Record<string, string>
    replace: Record<string, string>
    excludeExternal: string[]
    external: string[]

    // lerna mode
    lerna:
      | false
      | {
          // independentConfig: boolean
          pkgsOrder: string[]
          excludePkgs: string[]
        }

    // insider
    rollupChain: (rc: IRollupChain, pkgDir: string) => IRollupChain

    afterBuild: ICmd[]
  }
  lint: {
    eslint:
      | boolean
      | {
          include?: string[]
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
    beforeRelease: ICmd[]
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
