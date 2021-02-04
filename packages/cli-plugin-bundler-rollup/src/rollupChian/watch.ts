import type { WatcherOptions } from 'rollup'
import type { ChainedMapSet } from './lib/types'
import { ChainedMap } from './lib'

class Watch<T = any> extends ChainedMap<T> {
  buildDelay!: ChainedMapSet<WatcherOptions['buildDelay'], this>
  chokidar!: ChainedMapSet<WatcherOptions['chokidar'], this>
  clearScreen!: ChainedMapSet<WatcherOptions['clearScreen'], this>
  exclude!: ChainedMapSet<WatcherOptions['exclude'], this>
  include!: ChainedMapSet<WatcherOptions['include'], this>
  skipWrite!: ChainedMapSet<WatcherOptions['skipWrite'], this>
  private default = true

  constructor(parent: T) {
    super(parent)
    this.extend([
      'buildDelay',
      'chokidar',
      'clearScreen',
      'exclude',
      'include',
      'skipWrite'
    ])
  }

  false() {
    this.clear()
    this.default = false
    return this
  }

  true() {
    this.clear()
    this.default = true
    return this
  }

  toConfig(): WatcherOptions | boolean {
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

export type IWatch = InstanceType<typeof Watch>

export default Watch
