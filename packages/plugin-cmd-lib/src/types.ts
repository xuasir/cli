import type {
  ILibBuildTargets,
  IModifyRollupConfigCtx,
  IRollupChain
} from '@xus/cli'

export interface ILibBuildConfig {
  // lib build target: esm cjs broeser modern
  targets: ILibBuildTargets[]
  /**
   * point pkg name
   * package/core
   * pkg: ['core']
   */
  pointPkgs?: string[]
  // to custom rollup config
  rollupChain?: (
    rollupChain: IRollupChain,
    ctx: IModifyRollupConfigCtx
  ) => IRollupChain
  /**
   * lib packing is orderly when lerna mode
   * like ['shared', 'core']
   * shared should be roll before core
   */
  pkgOrder?: string[]
}

export type IPkg = {
  name: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}
