import type { RollupOptions } from 'rollup'

// validator
import validRequired from './validRequired'
import validPlugins from './validPlugins'

export default (config: RollupOptions) => {
  validRequired(config)
  validPlugins(config.plugins || [])
}
