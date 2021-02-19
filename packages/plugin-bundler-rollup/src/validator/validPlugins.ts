import type { Plugin } from 'rollup'
import type { CompileTargets } from '../types'

export default (plugins: Plugin[], prefix: CompileTargets) => {
  const hashMap = new Map<string, boolean>()
  plugins.forEach((plugin) => {
    const { name } = plugin
    if (hashMap.get(name)) {
      throw new Error(`[config: ${prefix}] plugin ${name} has repeat`)
    }
    hashMap.set(name, true)
  })
}
