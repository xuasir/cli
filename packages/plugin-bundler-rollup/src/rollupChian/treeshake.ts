import type { TreeshakingOptions } from 'rollup'
import type { IChainedMapSet } from './lib/types'
import { ChainedMap } from './lib'

class Treeshake<T = any> extends ChainedMap<T> {
  annotations!: IChainedMapSet<TreeshakingOptions['annotations'], this>
  moduleSideEffects!: IChainedMapSet<
    TreeshakingOptions['moduleSideEffects'],
    this
  >
  propertyReadSideEffects!: IChainedMapSet<
    TreeshakingOptions['propertyReadSideEffects'],
    this
  >
  tryCatchDeoptimization!: IChainedMapSet<
    TreeshakingOptions['tryCatchDeoptimization'],
    this
  >
  unknownGlobalSideEffects!: IChainedMapSet<
    TreeshakingOptions['unknownGlobalSideEffects'],
    this
  >
  private default = true

  constructor(parent: T) {
    super(parent)
    this.extend([
      'annotations',
      'moduleSideEffects',
      'propertyReadSideEffects',
      'tryCatchDeoptimization',
      'unknownGlobalSideEffects'
    ])
  }

  false() {
    this.clear()
    this.default = false
    return this
  }

  toConfig(): TreeshakingOptions | boolean {
    const entries = this.clean(this.entries() || {})
    if (Object.keys(entries).length) {
      return entries
    }
    return this.default
  }

  merge(obj: boolean | Record<string, any>, omit: string[] = []) {
    const isEmpty = this.isEmpty()
    // empty and default is true user dont change should merge base config
    if (isEmpty && this.default) {
      if (typeof obj === 'boolean') {
        this.default = obj
      } else {
        super.mergeBase(obj, omit)
      }
    }
  }
}

export type ITreeshake = InstanceType<typeof Treeshake>

export default Treeshake
