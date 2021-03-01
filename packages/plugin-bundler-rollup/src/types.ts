import type {
  ILibBuildTargets,
  IFastHookRegister,
  ILibBuildOps
} from '@xus/cli'
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

export type IDoBuildOps = {
  target: ILibBuildTargets
} & Omit<ILibBuildOps, 'targets'>
