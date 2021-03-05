import type { IPluginAPI, IFastHookRegister } from '@xus/cli'
import type { IRollupChain } from '@xus/rollup-chain'
import { BuildLibMethods } from './enum'

// for register method
export interface IBuildLibMethods {
  [BuildLibMethods.ModifyLibBundler]: IFastHookRegister<
    (bundler: IBundler) => IBundler
  >
  // modify config
  [BuildLibMethods.ModifyRollupConfig]: IFastHookRegister<
    (rollupChain: IRollupChain, ctx: IModifyRollupConfigCtx) => IRollupChain
  >
  [BuildLibMethods.GetRollupChainConfig]: (
    target: ILibBuildTargets
  ) => Promise<IRollupChain>
  // build event
  [BuildLibMethods.OnLibBuildFailed]: IFastHookRegister<(e: any) => void>
  [BuildLibMethods.OnLibBuildSucceed]: IFastHookRegister<
    (stats: ILibBuildStats) => void
  >
  // fast get
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

// for bundler
export interface IBundlerImp {
  build: (ops: ILibBuildOps) => Promise<ILibBuildStats>
  [key: string]: any
}

export interface IBundler {
  new (api: IPluginAPI): IBundlerImp
}

// for esm tagret
type ITargets = 'esm' | 'cjs' | 'browser' | 'modern'
export type ILibBuildTargets = ITargets | 'rollTypes'

export type IModifyRollupConfigCtx = {
  [key in ILibBuildTargets]: boolean
}

export interface ILibBuildConfig {
  // lib build target: esm cjs broeser modern
  targets: ITargets[]
  /**
   * point pkg name
   * package/core
   * pkg: ['core']
   */
  pointPkgs?: string[]
  // to custom rollup config
  rollupChain?: (
    rollupChain: IRollupChain,
    ctx: Omit<IModifyRollupConfigCtx, 'rollTypes'>
  ) => IRollupChain
  /**
   * lib packing is orderly when lerna mode
   * like ['shared', 'core']
   * shared should be roll before core
   */
  pkgOrder?: string[]
  rollTypes?: boolean
}
