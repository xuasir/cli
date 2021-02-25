import type { PluginImpl, Plugin as RollupPlugin } from 'rollup'
import type { IChainedMapSet } from './lib/types'
import { ChainedMap } from './lib'

class Plugin<T = any> extends ChainedMap<T> {
  private name: string
  private type: string
  private init!: IChainedMapSet<
    (plugin: PluginImpl, args: any[]) => RollupPlugin,
    this
  >

  constructor(parent: T, name: string, type = 'plugin') {
    super(parent)
    this.name = name
    this.type = type
    this.extend(['init'])
    this.init((plugin, args) => {
      if (typeof plugin === 'function') {
        return args ? plugin(...args) : plugin()
      }
      return plugin
    })
  }

  use<T extends PluginImpl<Record<string, any>>>(
    plugin: T,
    args?: Parameters<T>
  ) {
    this.set('plugin', plugin)
    if (args) {
      this.set('args', args)
    }
    return this
  }

  tap(f: (...args: any[]) => any[]) {
    this.set('args', f(this.get('args') || []))
    return this
  }

  set(key: 'plugin' | 'args', value: any) {
    if (key === 'args' && !Array.isArray(value)) {
      throw new Error(`args should be arrary`)
    }
    return super.set(key, value)
  }

  toConfig() {
    const init = this.get('init')
    const plugin = this.get('plugin')
    const args = this.get('args')
    if (!plugin) return undefined
    const pluginOps = init(plugin, args) as RollupPlugin
    Object.defineProperties(pluginOps, {
      __pluginName: { value: this.name },
      __before: { value: this.__before },
      __after: { value: this.__after }
    })
    return pluginOps
  }

  // orderable
  private __after!: string
  private __before!: string

  before(name: string) {
    if (this.__after) {
      throw new Error(
        `Unable to set .before(${JSON.stringify(
          name
        )}) with existing value for .after()`
      )
    }

    this.__before = name
    return this
  }

  after(name: string) {
    if (this.__before) {
      throw new Error(
        `Unable to set .after(${JSON.stringify(
          name
        )}) with existing value for .before()`
      )
    }

    this.__after = name
    return this
  }
}

export type IPlugin = InstanceType<typeof Plugin>

export default Plugin
