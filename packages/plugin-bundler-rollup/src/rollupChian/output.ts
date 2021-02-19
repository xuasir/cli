import type { OutputOptions } from 'rollup'
import type { ChainedMapSet } from './lib/types'
import { ChainedMap } from './lib'

class Output<T = any> extends ChainedMap<T> {
  file!: ChainedMapSet<string, this>
  globals!: ChainedMapSet<OutputOptions['globals'], this>
  name!: ChainedMapSet<string, this>
  paths!: ChainedMapSet<OutputOptions['paths'], this>
  sourcemap!: ChainedMapSet<boolean, this>
  format!: ChainedMapSet<OutputOptions['format'], this>
  banner!: ChainedMapSet<OutputOptions['banner'], this>
  footer!: ChainedMapSet<OutputOptions['footer'], this>
  intro!: ChainedMapSet<OutputOptions['intro'], this>
  outro!: ChainedMapSet<OutputOptions['outro'], this>

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
