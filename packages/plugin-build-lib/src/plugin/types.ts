import type { IPluginAPI } from '@xus/cli'
import { Methods } from './enum'

// for register method
export interface IMethods {
  [Methods.ModifyLibBundler]: (bundler: IBundlerImp) => IBundlerImp
  [Methods.OnLibBuildFailed]: (e: any) => void
  [Methods.OnLibBuildSucceed]: (stats: IBuildRes) => void
  [Methods.RunBuild]: () => void
}

export type IModifyConfigContext = {
  [key in ITargets]: boolean
}

// for bundler inter
export interface IBuildStats {
  info: string
}

export type IBuildRes = {
  [key in ITargets]?: IBuildRes
}

export interface IBundlerImp {
  build: () => Promise<IBuildRes>
  [key: string]: any
}

export interface IBundler extends IBundlerImp {
  new (api: IPluginAPI): IBundlerImp
}

// for esm tagret
export type ITargets = 'esm' | 'cjs' | 'browser' | 'modern'
