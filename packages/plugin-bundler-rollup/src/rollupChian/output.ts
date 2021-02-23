import type { OutputOptions } from 'rollup'
import type { IChainedMapSet } from './lib/types'
import { ChainedMap } from './lib'

class Output<T = any> extends ChainedMap<T> {
  file!: IChainedMapSet<string, this>
  globals!: IChainedMapSet<OutputOptions['globals'], this>
  name!: IChainedMapSet<string, this>
  paths!: IChainedMapSet<OutputOptions['paths'], this>
  sourcemap!: IChainedMapSet<boolean, this>
  format!: IChainedMapSet<OutputOptions['format'], this>
  banner!: IChainedMapSet<OutputOptions['banner'], this>
  footer!: IChainedMapSet<OutputOptions['footer'], this>
  intro!: IChainedMapSet<OutputOptions['intro'], this>
  outro!: IChainedMapSet<OutputOptions['outro'], this>

  constructor(parent: T) {
    super(parent)
    this.extend([
      'file',
      'globals',
      'name',
      'paths',
      'sourcemap',
      'format',
      'banner',
      'footer',
      'intro',
      'outro'
    ])
  }
}

export type IOutput = InstanceType<typeof Output>

export default Output
