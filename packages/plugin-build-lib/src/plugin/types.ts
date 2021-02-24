import type { IPluginAPI, IFastHookRegister } from '@xus/cli'
import { BuildLibMethods } from './enum'

// for register method
export interface IBuildLibMethods {
  [BuildLibMethods.ModifyLibBundler]: IFastHookRegister<
    (bundler: IBundlerImp) => IBundlerImp
  >
  [BuildLibMethods.OnLibBuildFailed]: IFastHookRegister<(e: any) => void>
  [BuildLibMethods.OnLibBuildSucceed]: IFastHookRegister<
    (stats: ILibBuildRes) => void
  >
  [BuildLibMethods.RunLibBuild]: (ops: Partial<ILibBuildOps>) => void
}

// for bundler imp
export interface ILibBuildStats {
  info: string
}

export type ILibBuildRes = {
  [key in ILibBuildTargets]?: ILibBuildStats
}

export interface ILibBuildOps {
  targets: ILibBuildTargets[]
  watch: boolean
  pointPkg: string
  [key: string]: any
}

export interface IBundlerImp {
  build: (ops: ILibBuildOps) => Promise<ILibBuildRes>
  [key: string]: any
}

export interface IBundler extends IBundlerImp {
  new (api: IPluginAPI): IBundlerImp
}

// for esm tagret
export type ILibBuildTargets = 'esm' | 'cjs' | 'browser' | 'modern'
