import type {
  ILibBuildTargets,
  IModifyRollupConfigCtx,
  IRollupChain
} from '@xus/cli'

export interface ILibBuildConfig {
  targets: ILibBuildTargets[]
  pkg: string
  rollupChain: (
    rollupChain: IRollupChain,
    ctx: IModifyRollupConfigCtx
  ) => IRollupChain
}

export type IPkg = {
  name: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}
