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
}

export type IWatch = InstanceType<typeof Watch>

export default Watch
