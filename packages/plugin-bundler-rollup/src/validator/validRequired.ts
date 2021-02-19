import type { CompileConfig } from '../rollupChian'
import type { CompileTargets } from '../types'

export default (config: CompileConfig, prefix: CompileTargets) => {
  if (!config.input) {
    throw new Error(`[config: ${prefix}] has no input options`)
  }
  if (!config.output) {
    throw new Error(`[config: ${prefix}] has no output options`)
  }
  if (!config.plugins || config.plugins.length < 1) {
    throw new Error(`[config: ${prefix}] has no plugins`)
  }
}
