import type { IPluginAPI } from '@xus/cli'
import createBabelConfig, { Preset } from '../config/babel.config'
// rollup plugins
import { nodeResolve as nodeResolvePlugin } from '@rollup/plugin-node-resolve'
import commonjsPlugin from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'

export async function compileJs(
  api: IPluginAPI,
  isReact = false
): Promise<void> {
  // 1.1 load babel config
  let presetName = '@xus/babel-preset'
  isReact && (presetName = '@xus/babel-preset/lib/react')

  const babelConfig =
    (await api.ConfigManager.loadConfig(
      api.PathManager.getPath('babel.config.js')
    )) || createBabelConfig(presetName as Preset)
  // 1.2 register common config
  api.RollupManager.registerChainFn((rollupChain) => {
    rollupChain
      .when('all')
      .input(api.PathManager.getPath('src/index.js'))
      .treeshake.moduleSideEffects(false)
      .end()

      .plugin('nodeResolve')
      .use(nodeResolvePlugin, [
        { preferBuiltins: true, extensions: ['.js', '.jsx', '.json'] }
      ])
      .before('commonjs')
      .end()

      .plugin('commonjs')
      .use(commonjsPlugin, [{ sourceMap: false }])
      .before('babel')
      .end()
    // react set
    if (isReact) {
      rollupChain
        .when('all')
        .output.globals({ react: 'React', 'react-dom': 'ReactDom' })
        .end()
        .external.set('react')
        .set('react-dom')
    }
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
    // set external
    rollupChain
      .when('esm-bundler')
      .plugin('babel')
      .use(babel, [{ ...babelConfig, babelHelpers: 'runtime' }])
      .end()
      .external.set(/^@babel\/runtime/)
    rollupChain
      .when('node')
      .plugin('babel')
      .use(babel, [{ ...babelConfig, babelHelpers: 'runtime' }])
      .end()
      .external.set(/^@babel\/runtime/)
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
