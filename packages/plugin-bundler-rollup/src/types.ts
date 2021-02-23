import type { ITargets } from '@xus/plugin-build-lib'
import type { IRollupChain } from './rollupChian'

export enum Methods {
  ModifyRollupConfig = 'modifyRollupConfig'
}

export type IModifyRollupConfigCtx = {
  [key in ITargets]: boolean
}

export type IMethods = {
  [Methods.ModifyRollupConfig]: (
    rollupChain: IRollupChain,
    ctx: IModifyRollupConfigCtx
  ) => IRollupChain
}
