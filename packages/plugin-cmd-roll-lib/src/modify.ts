import { IPluginAPI, IRollupChain } from '@xus/cli-types'
import { WarningHandler, RollupWarning } from 'rollup'
import { join } from 'path'
import { IResolvedConfig } from './types'
// plugin
import { esbuildPlugin } from './plugins/esbuild'
import { minifyPlugin } from './plugins/minify'
import { assetPlugin } from './plugins/asset'
import { jsonPlugin } from './plugins/json'
import { cssPlugin } from './plugins/css'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

export function modifyConfig(
  rc: IRollupChain,
  resolvedConfig: IResolvedConfig,
  api: IPluginAPI
) {
  // node resolve commonjs
  rc.plugin('nodeResolve').use(nodeResolve, [
    {
      mainFields: ['jsnext:main', 'module', 'main'],
      preferBuiltins: true,
      extensions
    }
  ])
  rc.plugin('commonjs').use(commonjs).after('commonjs')

  // esbuild
  rc.plugin('$$esbuild').use(esbuildPlugin, [
    {
      include: /\.(jsx|tsx?)$/,
      exclude: /\.js$/
    }
  ])
  // minify
  const target = resolvedConfig.target
  rc.plugin('$$minify').use(minifyPlugin, [
    {
      minify: resolvedConfig.minify,
      esbuildMinifyOps: {
        target
      }
    }
  ])

  // css
  const css = resolvedConfig.css
  rc.plugin('$$css').use(cssPlugin, [
    {
      injectScript: css.injectScript,
      cssCodeSplit: css.cssCodeSplit,
      minify: !!resolvedConfig.minify,
      modules: css.modules || {},
      postcss: css.postcss,
      preprocessorOptions: css.preprocessor
    }
  ])

  // asset
  rc.plugin('asset').use(assetPlugin, [
    {
      assetDir: 'assets',
      assetRoot: join(api.cwd, 'assets'),
      inlineLimit: 0
    }
  ])

  // json
  rc.plugin('$$json').use(jsonPlugin, [
    {
      exportMode: 'stringify'
    }
  ])

  //alias
  rc.plugin('alias').use(alias, [
    {
      entries: [{ find: '@', replacement: join(api.cwd, 'src') }]
    }
  ])
  rc.plugin('replace').use(replace, [
    {
      preventAssignment: true
    }
  ])

  // external
  // TODO: excludeExternal config
  getPkgDeps(api.cwd).forEach((dep) => rc.external.set(dep))

  // onwarn
  rc.onwarn((warning, onwarn) => {
    onRollupWarning(warning, onwarn)
  })
}

const RollupWarningIgnoreList = ['THIS_IS_UNDEFINED']
function onRollupWarning(warning: RollupWarning, onwarn: WarningHandler) {
  if (RollupWarningIgnoreList.includes(warning.code!)) return
  onwarn(warning)
}

function getPkgDeps(root: string): string[] {
  let pkg = null
  try {
    pkg = require(join(root, 'package.json'))
  } catch {
    //
  }
  let deps: string[] = []
  if (pkg) {
    deps = [
      ...Object.keys(pkg?.dependencies || {}),
      ...Object.keys(pkg?.peerDependencies || {})
    ]
  }
  return deps
}
