import type { IPluginAPI } from '@xus/cli'
import type { IRollupManager } from '../rollupManager'
import { addExternals, addPlugin } from '../rollupManager'
// rollup plugins
import { createBabelPlugin, createCommonjsPlugin } from './rollupPlugin'

export async function compileJs(
  rollupManager: IRollupManager,
  api: IPluginAPI
): Promise<void> {
  // 1. base override config
  // 1.1 load babel config
  const babelConfig = await api.ConfigManager.loadConfig(
    api.PathManager.getPath('babel.config.js')
  )
  // 1.2 register base overrideFn
  rollupManager.registerOverrideFn(
    addExternals(({ isESM, isCJS }) => {
      if (isESM || isCJS) return [/@babel\/runtime/]
      return []
    }),
    // handle of compile plugin
    addPlugin((mode) => {
      const plugins = []
      // cjs plugins
      plugins.push(...createCommonjsPlugin(mode))
      // babel plugin
      plugins.push(...createBabelPlugin(babelConfig, mode, false, false))
      return plugins
    })
  )
  // 2. run build
  return rollupManager.build()
}
