import type { IPluginAPI } from '@xus/cli'
import createBabelConfig from '../config/babel.config'
// rollup plugins
import nodeResolvePlugin from '@rollup/plugin-node-resolve'
import commonjsPlugin from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import aliasPlugin from 'rollup-plugin-alias'

export async function compileJs(api: IPluginAPI): Promise<void> {
  // 1.1 load babel config
  const babelConfig =
    (await api.ConfigManager.loadConfig(
      api.PathManager.getPath('babel.config.js')
    )) || createBabelConfig('@xus/babel-preset')
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

    rollupChain
      .when('esm-browser')
      .output.file(api.PathManager.getPath('lib/index.esm-browser.js'))

    rollupChain
      .when('global')
      .output.file(api.PathManager.getPath('lib/index.global.js'))
      .name('IndexGlobal')

    rollupChain
      .when('node')
      .output.file(api.PathManager.getPath('lib/index.cjs.js'))
      .end()
      .plugin('nodeResolve')
      .end()
      .plugin('commonjs')
      .end()

    // base babel
    rollupChain
      .when('all')
      .plugin('babel')
      .use(babel, [{ ...babelConfig, babelHelpers: 'runtime' }])
    // set external
    rollupChain.when('esm-bundler').external.set(/^@babel\/runtime/)
    rollupChain.when('node').external.set(/^@babel\/runtime/)
    // set full pkg babel
    rollupChain
      .when('global')
      .plugin('babel')
      .use(babel, [{ ...babelConfig, babelHelpers: 'bundled' }])
    rollupChain
      .when('esm-browser')
      .plugin('babel')
      .use(babel, [{ ...babelConfig, babelHelpers: 'bundled' }])
  }, true)
  // 2. run build
  return api.RollupManager.build(api)
}
