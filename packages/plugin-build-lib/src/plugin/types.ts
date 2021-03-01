import type { IPluginAPI, IFastHookRegister } from '@xus/cli'
import { BuildLibMethods } from './enum'

// for register method
export interface IBuildLibMethods {
  [BuildLibMethods.ModifyLibBundler]: IFastHookRegister<
    (bundler: IBundler) => IBundler
  >
  [BuildLibMethods.OnLibBuildFailed]: IFastHookRegister<(e: any) => void>
  [BuildLibMethods.OnLibBuildSucceed]: IFastHookRegister<
    (stats: ILibBuildStats) => void
  >
  [BuildLibMethods.RunLibBuild]: (ops: Partial<ILibBuildOps>) => void
}

// for bundler imp
export interface ILibBuildStats {
  info?: string
  watch: boolean
}

export interface ILibBuildOps {
  targets: ILibBuildTargets[]
  watch: boolean
  pointPkg?: string[]
  order?: string[]
}

export interface IBundlerImp {
  build: (ops: ILibBuildOps) => Promise<ILibBuildStats>
  [key: string]: any
}

export interface IBundler {
  new (api: IPluginAPI): IBundlerImp
}

// for esm tagret
export type ILibBuildTargets = 'esm' | 'cjs' | 'browser' | 'modern'
