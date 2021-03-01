import type { IRollupChain, IModifyRollupConfigCtx, IPluginAPI } from '@xus/cli'
import type { IPkg } from './types'
import { getFileMeta, lookUpFile, resolve } from '@xus/cli'
import semver from 'semver'
import { join, extname } from 'path'
import { BuiltInRollupPlugin, ExternalMatchBabelReg } from './enum'
import getBabelConfig from './getBabelConfig'
// rollup plugin
// @ts-ignore
import url from '@rollup/plugin-url'
// @ts-ignore
import svgr from '@svgr/rollup'
import json from '@rollup/plugin-json'
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import typescript2 from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import vue2 from '@xus/rollup-plugin-vue2'
import vue3 from 'rollup-plugin-vue'
// css
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'

const extensions = ['.js', '.jsx', '.ts', '.tsx', '.vue']

export const defaultInput = (
  rc: IRollupChain,
  _: IModifyRollupConfigCtx,
  api: IPluginAPI
) => {
  api.logger.debug(`default input `)
  // auto search entry index.(js|jsx|ts|tsx|vue) src/index.(js|jsx|ts|tsx|vue)
  const fileMeta =
    getFileMeta({
      base: api.cwd,
      filenameWithoutExt: 'index',
      type: 'lib'
    }) ||
    getFileMeta({
      base: join(api.cwd, 'src'),
      filenameWithoutExt: 'index',
      type: 'lib'
    })

  if (fileMeta) {
    rc.input(fileMeta.path)
  }

  api.logger.debug(rc.get('input'))
}

export const ensureOutput = (
  rc: IRollupChain,
  ctx: IModifyRollupConfigCtx,
  api: IPluginAPI
) => {
  api.logger.debug(`ensure output `)
  const isProd = api.mode === 'production'
  let outFile = rc.output.get('file') as string
  const globalName = rc.output.get('name') as string
  if (!outFile) {
    // auto gen output
    rc.output.file(api.getPathBasedOnCtx('dist/index.js'))
    outFile = rc.output.get('file') as string
  }

  if (ctx.esm) {
    rc.output.file(outFile.replace(/.js$/, getExt('esm', isProd))).format('es')
  } else if (ctx.cjs) {
    rc.output
      .file(outFile.replace(/.js$/, getExt('cjs', isProd)))
      .format('cjs')
      .exports('named')
  } else if (ctx.browser) {
    if (!globalName)
      throw new Error(`build for browser should has a global name`)

    rc.output
      .file(outFile.replace(/.js$/, getExt('global', isProd)))
      .format('umd')
      .globals({
        vue: 'Vue',
        react: 'React',
        'react-dom': 'ReactDom'
      })
      .exports('named')
  } else if (ctx.modern) {
    rc.output
      .file(outFile.replace(/.js$/, getExt('modern', isProd)))
      .format('es')
  }

  api.logger.debug(rc.output.get('file'))
}

export const ensureCommonPlugin = (
  rc: IRollupChain,
  ctx: IModifyRollupConfigCtx,
  api: IPluginAPI
) => {
  api.logger.debug(`ensure common plugin `)
  // node and data source
  rc.plugin(BuiltInRollupPlugin.Url).use(url)
  rc.plugin(BuiltInRollupPlugin.Svgr).use(svgr).after(BuiltInRollupPlugin.Url)
  rc.plugin(BuiltInRollupPlugin.NodeResolve).use(nodeResolve, [
    {
      mainFields: ['jsnext:main', 'module', 'main'],
      extensions
    }
  ])
  if (ctx.browser || ctx.modern) {
    // need rollup a full pkg
    rc.plugin(BuiltInRollupPlugin.Commonjs)
      .use(commonjs)
      .after(BuiltInRollupPlugin.NodeResolve)
  }

  rc.plugin(BuiltInRollupPlugin.Json).use(json)
  rc.plugin(BuiltInRollupPlugin.Alias).use(alias, [
    {
      entries: [{ find: '@', replacement: join(api.cwd, 'src') }]
    }
  ])
  rc.plugin(BuiltInRollupPlugin.Replace).use(replace, [
    {
      preventAssignment: true
    }
  ])
}

export const ensureCorePlugin = (
  rc: IRollupChain,
  ctx: IModifyRollupConfigCtx,
  api: IPluginAPI
) => {
  api.logger.debug(`ensure core plugin `)

  // auto sniff vue
  let vueVersion: null | number = null
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Vue = require(resolve.sync('vue', {
      basedir: api.getCliEnv('Lerna_Root') || api.cwd
    }))
    vueVersion = semver.major(Vue.version)
  } catch (e) {
    //
  }
  if (vueVersion === 2) {
    rc.plugin(BuiltInRollupPlugin.Vue).use(vue2, [
      {
        css: false,
        exposeFilename: false
      }
    ])
  } else if (vueVersion === 3) {
    rc.plugin(BuiltInRollupPlugin.Vue).use(vue3, [
      {
        target: ctx.cjs ? 'node' : 'browser',
        exposeFilename: false
      }
    ])
  }
  api.logger.debug(`vue version ${vueVersion}`)

  // babel
  // change cwd to lerna root for preset/vue sniff vue version
  const cwd = api.cwd
  const lernaRoot = api.getCliEnv('Lerna_Root') || cwd
  process.chdir(lernaRoot)
  const babelConfig = getBabelConfig(ctx, !!vueVersion)
  process.chdir(cwd)
  rc.plugin(BuiltInRollupPlugin.Babel).use(babel, [
    {
      ...babelConfig,
      babelHelpers: ctx.browser || ctx.modern ? 'bundled' : 'runtime',
      exclude: /\/node_modules\//,
      babelrc: false,
      extensions
    }
  ])

  // should after ensureInput to auto sniff ts
  const entryExt = extname(rc.get('input') as string)

  const isTypescrip = entryExt === '.tsx' || entryExt === '.ts'

  if (isTypescrip) {
    // 1. find tsconfig.json
    const tsconfigPath = lookUpFile(api.cwd, ['tsconfig.json'], true)
    if (!tsconfigPath)
      throw new Error(
        `current build for typescript, but don't have a tsconfig.json`
      )

    // vue jsxFactory h
    const vueTsx = vueVersion ? { jsx: 'preserve', jsxFactory: 'h' } : {}

    rc.plugin(BuiltInRollupPlugin.Typescript)
      .use(typescript2, [
        {
          cwd: api.cwd,
          clean: true,
          cacheRoot: `${api.cwd}/.rpts2_cache`,
          tsconfig: tsconfigPath,
          tsconfigDefaults: {
            compilerOptions: {
              declaration: true,
              ...vueTsx
            }
          },
          tsconfigOverride: {
            compilerOptions: {
              target: 'esnext'
            }
          },
          check: true
        }
      ])
      // tsc --> babel
      .before(BuiltInRollupPlugin.Babel)
  }

  // terser
  if (api.mode === 'production') {
    rc.plugin(BuiltInRollupPlugin.Terser).use(terser, [
      {
        module: ctx.esm || ctx.modern,
        compress: {
          ecma: 2015,
          pure_getters: true
        }
      }
    ])
  }

  // postcss
  rc.plugin(BuiltInRollupPlugin.Postcss).use(postcss, [
    {
      extract: true,
      inject: false,
      modules: false,
      autoModules: true,
      plugins: [autoprefixer({ remove: false })]
    }
  ])
}

export const ensureOtherConfig = (
  rc: IRollupChain,
  ctx: IModifyRollupConfigCtx,
  api: IPluginAPI
) => {
  api.logger.debug(`ensure other plugin `)

  // get pkgJSON
  let pkgJson: IPkg | null = null
  try {
    pkgJson = require(api.getPathBasedOnCtx('package.json'))
  } catch (error) {
    //
  }

  if (pkgJson && (ctx.esm || ctx.cjs)) {
    // auto external dep peerDep
    ;[
      ...Object.keys(pkgJson.dependencies || {}),
      ...Object.keys(pkgJson.peerDependencies || {})
    ].forEach((pkg) => {
      rc.external.set(pkg)
    })
  }

  // external
  rc.external.set('vue').set('react').set('react-dom')
  if (ctx.esm || ctx.cjs) {
    rc.external.set(ExternalMatchBabelReg)
  }

  api.logger.debug(`external: ${rc.external.values()}`)
}

// helper
function getExt(mode: string, isProd = false) {
  return isProd ? `.${mode}.prod.js` : `.${mode}.js`
}
