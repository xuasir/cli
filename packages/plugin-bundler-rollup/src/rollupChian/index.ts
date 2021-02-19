import type { CompileTargets } from './../types'
import type { AllConfigs } from './lib/types'
import { ChainedMap } from './lib'
import Config, { IConfig } from './config'

class RollupChain {
  private targets

  constructor() {
    this.targets = new ChainedMap<this>(this)
  }

  when(target: CompileTargets | 'all') {
    return this.targets.getOrCompute(target, () => new Config(this))
  }

  toConfig() {
    const configs: Record<string, any> = {}
    const entries = this.targets.entries()
    if (entries) {
      const finalEntries = this.targets.clean(entries)
      let commonConfig = {}
      if ('all' in finalEntries) commonConfig = entries.all.entries() || {}

      Object.keys(finalEntries).forEach((key) => {
        if (key === 'all') return
        const configChain = entries[key] as IConfig
        // merge common config
        configChain.mergeBase(commonConfig)
        const config = configChain.toConfig()
        configs[key] = config
      })
    }

    return configs as AllConfigs
  }

  entries() {
    const targets = this.targets.clean(this.targets.entries() || {})

    return Object.keys(targets).reduce<Record<string, any>>((res, key) => {
      const config = targets[key] as IConfig
      res[key] = config.entries()
      return res
    }, {})
  }
}

export type IRollupChain = InstanceType<typeof RollupChain>

export default RollupChain

// export types
export * from './lib/types'
