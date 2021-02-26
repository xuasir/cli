import type { OutputOptions } from 'rollup'
import type { IChainedMapSet } from './lib/types'
import { ChainedMap } from './lib'

class Output<T = any> extends ChainedMap<T> {
  file!: IChainedMapSet<string, this>
  globals!: IChainedMapSet<OutputOptions['globals'], this>
  name!: IChainedMapSet<string, this>
  paths!: IChainedMapSet<OutputOptions['paths'], this>
  esModule!: IChainedMapSet<boolean, this>
  compact!: IChainedMapSet<boolean, this>
  sourcemap!: IChainedMapSet<boolean, this>
  sourcemapFile!: IChainedMapSet<OutputOptions['sourcemapFile'], this>
  format!: IChainedMapSet<OutputOptions['format'], this>
  banner!: IChainedMapSet<OutputOptions['banner'], this>
  footer!: IChainedMapSet<OutputOptions['footer'], this>
  intro!: IChainedMapSet<OutputOptions['intro'], this>
  outro!: IChainedMapSet<OutputOptions['outro'], this>
  amd!: IChainedMapSet<OutputOptions['amd'], this>
  exports!: IChainedMapSet<OutputOptions['exports'], this>
  assetFileNames!: IChainedMapSet<OutputOptions['assetFileNames'], this>
  chunkFileNames!: IChainedMapSet<OutputOptions['chunkFileNames'], this>
  entryFileNames!: IChainedMapSet<OutputOptions['entryFileNames'], this>
  namespaceToStringTag!: IChainedMapSet<boolean, this>
  inlineDynamicImports!: IChainedMapSet<boolean, this>
  manualChunks!: IChainedMapSet<OutputOptions['manualChunks'], this>

  constructor(parent: T) {
    super(parent)
    this.extend([
      'file',
      'globals',
      'name',
      'paths',
      'esModule',
      'compact',
      'sourcemap',
      'sourcemapFile',
      'format',
      'banner',
      'footer',
      'intro',
      'outro',
      'amd',
      'exports',
      'assetFileNames',
      'chunkFileNames',
      'entryFileNames',
      'namespaceToStringTag',
      'inlineDynamicImports',
      'manualChunks'
    ])
  }
}

export type IOutput = InstanceType<typeof Output>

export default Output
