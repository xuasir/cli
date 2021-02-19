import type { OutputOptions, Plugin, InputOptions } from 'rollup'
import type { CompileTargets } from '../../types'

export { IChainedMap } from './chainedMap'
export { IChainedSet } from './chainedSet'

export type ChainedMapSet<T = any, P = any> = (value: T) => P
export type ChainedSetAdd<T = any, P = any> = (value: T) => P

export type CompileConfig = {
  input: InputOptions['input']
  output: OutputOptions
  external?: InputOptions['external']
  onwarn?: InputOptions['onwarn']
  cache?: InputOptions['cache']
  context?: InputOptions['context']
  plugins: Plugin[]
  watch?: InputOptions['watch']
  treeshake?: InputOptions['treeshake']
}

export type AllConfigs = {
  [key in CompileTargets]?: CompileConfig
}
