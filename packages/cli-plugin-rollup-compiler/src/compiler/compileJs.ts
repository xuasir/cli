import type { IPluginAPI } from '@xus/cli'
// rollup plugins
import nodeResolvePlugin from '@rollup/plugin-node-resolve'
import commonjsPlugin from '@rollup/plugin-commonjs'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import aliasPlugin from 'rollup-plugin-alias'

export async function compileJs(api: IPluginAPI): Promise<void> {
  // 1. base override config
  // 1.1 load babel config
  const babelConfig = await api.ConfigManager.loadConfig(
    api.PathManager.getPath('babel.config.js')
  )
  // 1.2 register common config
  api.RollupManager.registerChainFn((rollupChain) => {
    rollupChain
      .when('all')
      .input(api.PathManager.getPath('src/index.js'))
      .treeshake.moduleSideEffects(false)
      .end()
      .plugin('nodeResolve')
      .use(nodeResolvePlugin, [{ preferBuiltins: true }])
      .before('commonjs')
      .end()
      .plugin('commonjs')
      .use(commonjsPlugin, [{ sourceMap: false }])
      .before('babel')
      .end()
      .plugin('alias')
      .use(aliasPlugin, [{ '@': api.PathManager.getPath('src') }])
      .end()
  }, true)
  // 1.3 register babel config
  api.RollupManager.registerChainFn((rollupChain) => {
    rollupChain
      .when('esm-bundler')
      .output.file(api.PathManager.getPath('lib/index.esm-bundler.js'))
      .end()
      .end()
      .when('esm-browser')
      .output.file(api.PathManager.getPath('lib/index.esm-browser.js'))
      .end()
      .end()
      .when('global')
      .output.file(api.PathManager.getPath('lib/index.global.js'))
      .end()
      .end()
      .when('node')
      .output.file(api.PathManager.getPath('lib/index.cjs.js'))
      .end()
      .end()

    if (babelConfig) {
      rollupChain
        .when('all')
        .plugin('babel')
        .use(getBabelOutputPlugin, [babelConfig])
    } else {
      rollupChain
        .when('esm-bundler')
        .plugin('babel')
        .use(getBabelOutputPlugin, [
          {
            presets: [
              [
                '@xus/babel-preset',
                { useESModules: true, absoluteRuntime: false }
              ]
            ]
          }
        ])
        .end()
        .end()
        .when('esm-browser')
        .plugin('babel')
        .use(getBabelOutputPlugin, [
          {
            presets: [
              [
                '@xus/babel-preset',
                {
                  useESModules: true,
                  useTransformRuntime: false,
                  useDynamicImport: true
                }
              ]
            ]
          }
        ])
        .end()
        .end()
        .when('global')
        .plugin('babel')
        .use(getBabelOutputPlugin, [
          {
            presets: [
              [
                '@xus/babel-preset',
                { useTransformRuntime: false, useDynamicImport: true }
              ]
            ]
          }
        ])
        .end()
        .end()
        .when('node')
        .plugin('babel')
        .use(getBabelOutputPlugin, [
          {
            presets: [
              [
                '@xus/babel-preset',
                { absoluteRuntime: false, useDynamicImport: true }
              ]
            ]
          }
        ])
        .end()
        .end()
    }
  }, true)
  // 2. run build
  return api.RollupManager.build()
}
