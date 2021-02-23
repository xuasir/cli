import type { Plugin } from 'rollup'

export default (plugins: Plugin[]) => {
  const hashMap = new Map<string, boolean>()
  plugins.forEach((plugin) => {
    const { name } = plugin
    if (hashMap.get(name)) {
      throw new Error(`rollup plugin ${name} has repeat`)
    }
    hashMap.set(name, true)
  })
}
