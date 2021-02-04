import type { IRollupChain } from '../rollupChian'
// targets  formats
export type CompileTargets = 'esm-bundler' | 'node' | 'global' | 'esm-browser'

export type CompileFormats = 'esm' | 'cjs' | 'iife'

export type ChainFn = (rollupChain: IRollupChain) => void

export enum Target2Format {
  'esm-bundler' = 'esm',
  'node' = 'cjs',
  'global' = 'iife',
  'esm-browser' = 'esm'
}

// rollup plugin config
export type RollupPluginConfig = {
  // override fn
  chainRollup: ChainFn
  // output format node global esm-bundler esm-browser
  targets: CompileTargets[]
}
