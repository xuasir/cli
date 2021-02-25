import type { ILibBuildTargets, IFastHookRegister } from '@xus/cli'
import type { IRollupChain } from './rollupChian'

// for plugin
export enum BundlerRollupMethods {
  ModifyRollupConfig = 'modifyRollupConfig'
}

export type IModifyRollupConfigCtx = {
  [key in ILibBuildTargets]: boolean
}

export type IBundlerRollupMethods = {
  [BundlerRollupMethods.ModifyRollupConfig]: IFastHookRegister<
    (rollupChain: IRollupChain, ctx: IModifyRollupConfigCtx) => IRollupChain
  >
}

// for bundler
export interface IDoBuildOps {
  target: ILibBuildTargets
  watch: boolean
  pointPkg: string
}
