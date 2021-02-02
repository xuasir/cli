import type { RollupConfig } from '../../types'
import replacePlugin from 'rollup-plugin-replace'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import aliasPlugin from 'rollup-plugin-alias'

export const createAliasAndReplacePlugin = (config: RollupConfig) => {
  const plugins = []
  const alias = config?.alias
  const replace = config?.replace
  if (alias) {
    plugins.push(aliasPlugin(alias))
  }
  if (replace) {
    plugins.push(replacePlugin(replace))
  }
  return plugins
}
