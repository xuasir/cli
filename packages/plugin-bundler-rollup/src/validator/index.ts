import type { CompileConfig } from '../rollupChian'
import type { CompileTargets } from '../types'
// validator
import validRequired from './validRequired'
import validPlugins from './validPlugins'

export default (config: CompileConfig, prefix: CompileTargets) => {
  validRequired(config, prefix)
  validPlugins(config.plugins, prefix)
}
