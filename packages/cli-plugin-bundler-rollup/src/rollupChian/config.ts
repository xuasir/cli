import type { RollupOptions } from 'rollup'
import type { ChainedMapSet, CompileConfig } from './lib/types'
// ops
import { ChainedMap } from './lib'
import Output from './output'
import Plugin, { IPlugin } from './plugin'
import Treeshake from './treeshake'
import Watch from './watch'

class Config<T = any> extends ChainedMap<T> {
  input!: ChainedMapSet<RollupOptions['input'], this>
  external!: ChainedMapSet<RollupOptions['external'], this>
  cache!: ChainedMapSet<RollupOptions['cache'], this>
  onwarn!: ChainedMapSet<RollupOptions['onwarn'], this>
  context!: ChainedMapSet<RollupOptions['context'], this>
  watch
  treeshake
  output
  private plugins

  constructor(parent: T) {
    super(parent)
    this.output = new Output<this>(this)
    this.treeshake = new Treeshake<this>(this)
    this.watch = new Watch<this>(this)
    this.plugins = new ChainedMap<this>(this)
    this.extend(['input', 'external', 'cache', 'onwarn', 'context'])
  }

  plugin(name: string) {
    return this.plugins.getOrCompute(name, () => new Plugin(this, name))
  }

  toConfig() {
    const entries = this.entries() || {}
    entries.output = this.output.entries()
    entries.treeshake = this.treeshake.toConfig()
    entries.watch = this.watch.toConfig()
    entries.plugins = this.plugins
      .values()
      .map((plugin) => (plugin as IPlugin).toConfig())

    const finalEntries = this.clean(entries) as CompileConfig
    return !Object.keys(finalEntries).length ? null : finalEntries
  }

  entries() {
    const entries = super.entries() || {}
    // patch output plugins
    entries.output = this.output.entries()
    entries.plugins = this.plugins.entries()
    entries.treeshake = this.treeshake.toConfig()
    entries.watch = this.watch.toConfig()
    // clean and output
    return this.clean(entries)
  }

  mergeBase(obj: Record<string, any>) {
    super.mergeBase(obj, ['plugins', 'output', 'treeshake', 'watch'])
    // merge output
    if ('output' in obj) {
      this.output.mergeBase(obj?.output || {})
    }
    // merge plugins
    if ('plugins' in obj) {
      this.plugins.mergeBase(obj?.plugins || {})
    }
    // merge treeshake
    if ('treeshake' in obj) {
      this.treeshake.merge(obj?.treeshake || true)
    }
    // merge watch
    if ('watch' in obj) {
      this.watch.merge(obj?.watch || false)
    }

    return this
  }
}

export type IConfig = InstanceType<typeof Config>

export default Config
