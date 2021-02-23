import type { WatcherOptions } from 'rollup'
import type { IChainedMapSet } from './lib/types'
import { ChainedMap } from './lib'

class Watch<T = any> extends ChainedMap<T> {
  buildDelay!: IChainedMapSet<WatcherOptions['buildDelay'], this>
  chokidar!: IChainedMapSet<WatcherOptions['chokidar'], this>
  clearScreen!: IChainedMapSet<WatcherOptions['clearScreen'], this>
  exclude!: IChainedMapSet<WatcherOptions['exclude'], this>
  include!: IChainedMapSet<WatcherOptions['include'], this>
  skipWrite!: IChainedMapSet<WatcherOptions['skipWrite'], this>

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
