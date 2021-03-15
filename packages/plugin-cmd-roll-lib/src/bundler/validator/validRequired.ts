import type { RollupOptions } from 'rollup'

export default (config: RollupOptions) => {
  if (!config?.input) {
    throw new Error(`config has no input options`)
  }
  if (!config?.plugins || config.plugins.length < 1) {
    throw new Error(`config has no plugins`)
  }
}
