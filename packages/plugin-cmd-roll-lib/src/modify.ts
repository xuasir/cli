import { IPluginAPI, IRollupChain } from '@xus/cli-types'
import { WarningHandler, RollupWarning } from 'rollup'
import { join } from 'path'
import { IResolvedConfig } from './types'
// plugin
import { esbuildPlugin } from './plugins/esbuild'
import { minifyPlugin } from './plugins/minify'
import { assetPlugin } from './plugins/asset'
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

  const sourcemap = !!resolvedConfig.sourcemap
  const target = resolvedConfig.target
  // esbuild
  rc.plugin('$$esbuild').use(esbuildPlugin, [
    {
      target,
      sourcemap
    }
  ])
  // minify
  rc.plugin('$$minify').use(minifyPlugin, [
    {
      minify: resolvedConfig.minify,
      esbuildMinifyOps: {
        target,
        sourcemap
      },
      terserMinifyOps: {
        sourceMap: sourcemap
      }
    }
  ])

  // css

  // asset
  rc.plugin('asset').use(assetPlugin, [
    {
      assetDir: 'assets',
      assetRoot: join(api.cwd, 'assets'),
      inlineLimit: 0
    }
  ])

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

  // onwran
  rc.onwarn((wraning, onwran) => {
    onRollupWraning(wraning, onwran)
  })
}

const RollupWraningIgnoreList = ['THIS_IS_UNDEFINED']
function onRollupWraning(wraning: RollupWarning, onwran: WarningHandler) {
  if (RollupWraningIgnoreList.includes(wraning.code!)) return
  onwran(wraning)
}
