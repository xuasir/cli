import { Logger, chalk } from '@xus/cli-shared'
import { Plugin, RollupError, SourceMap, NormalizedOutputOptions } from 'rollup'
import { dataToEsm } from '@rollup/pluginutils'
import { cleanUrl } from '../utils'
import MagicString from 'magic-string'
import * as Postcss from 'postcss'
import * as Sass from 'sass'
import * as Less from 'less'
import CleanCss from 'clean-css'

const logger = new Logger(`xus:rollup:css`)

// inline string / url / module
export interface ICssModulesOps {
  getJSON?: (
    cssFileName: string,
    json: Record<string, string>,
    outputFileName: string
  ) => void
  scopeBehaviour?: 'global' | 'local'
  globalModulePaths?: string[]
  generateScopedName?:
    | string
    | ((name: string, filename: string, css: string) => string)
  hashPrefix?: string
  /**
   * default: null
   */
  localsConvention?:
    | 'camelCase'
    | 'camelCaseOnly'
    | 'dashes'
    | 'dashesOnly'
    | null
}

export type IPostcssOps = Postcss.ProcessOptions & {
  plugins?: Postcss.Plugin[]
}
export type IPreprocessorOps = Partial<Record<string, any>>
interface ICssOps {
  injectMode?: false | 'script' | 'url'
  cssCodeSplit?: boolean
  minify?: boolean
  // ops
  modules?: ICssModulesOps
  postcss?: IPostcssOps
  preprocessorOptions?: IPreprocessorOps
}

const cssLang = `\\.(css|less|sass|scss|styl|stylus|postcss)($|\\?)`
const cssLangRE = new RegExp(cssLang)
const cssModuleRE = new RegExp(`\\.module${cssLang}`)
const commonjsProxyRE = /\?commonjs-proxy/

const cssCache = new Map<string, string>()
const opsToFullCssChunk = new WeakMap<NormalizedOutputOptions, string>()
export function cssPlugin(ops?: ICssOps): Plugin {
  const { cssCodeSplit = false, injectMode = false, minify = false } = ops || {}
  let hasGenFullStyle = false
  return {
    name: 'xus:rollup:css',
    async transform(code, id) {
      if (!cssLangRE.test(id) || commonjsProxyRE.test(id)) return null
      logger.debug(`transform css `, id)
      const { code: css, modules, map, deps } = await compileCss(id, code, ops!)
      cssCache.set(id, css)
      const modulesCode =
        modules &&
        dataToEsm(modules, {
          namedExports: true,
          preferConst: true
        })
      const finalCss = modulesCode

      logger.debug(`modules: `)
      logger.debug(modules)
      logger.debug(`deps: `)
      logger.debug(deps)
      logger.debug(`final code: `)
      logger.debug(finalCss)

      return {
        code: finalCss || '',
        map: finalCss && map ? map : undefined,
        moduleSideEffects: modulesCode ? false : 'no-treeshake'
      }
    },
    async renderChunk(code, chunk, ops) {
      const ids = Object.keys(chunk.modules)
      let cssChunk = ''
      // collect all css
      for (const id of ids) {
        if (cssCache.has(id)) {
          cssChunk += cssCache.get(id)
        }
      }
      if (!cssChunk) return null

      if (cssCodeSplit) {
        logger.debug(`css code split: `)
        // bundle a css for every chunk
        // 1. minify  replace
        cssChunk = await processCssChunk(cssChunk, {
          inject: !!injectMode,
          minify
        })
        // 2. inject code
        const filename = `${chunk.name}.css`
        let injectCode = ''
        if (injectMode === 'script') {
          const style = `__xus__style__`
          injectCode =
            `var ${style} = document.createElement('style');\n` +
            `${style}.innerHTML = ${JSON.stringify(cssChunk)};\n` +
            `document.head.appendChild(${style});`
        } else if (injectMode === 'url') {
          injectCode = `import './css/${filename}';\n`
        }
        const s = new MagicString(code)
        s.prepend(injectCode)
        this.emitFile({
          fileName: `css/${filename}`,
          type: 'asset',
          source: cssChunk
        })

        logger.debug(`filename, code: `)
        logger.debug(filename, s.toString())

        return {
          code: s.toString(),
          map: ops.sourcemap ? s.generateMap({ hires: true }) : undefined
        }
      } else {
        // bundle a full css
        opsToFullCssChunk.set(
          ops,
          (opsToFullCssChunk.get(ops) || '') + cssChunk
        )
      }
      return null
    },
    async generateBundle(ops) {
      const cssChunk = opsToFullCssChunk.get(ops)
      if (cssChunk && !hasGenFullStyle) {
        hasGenFullStyle = true
        // minify
        let resCss = cssChunk
        if (minify) {
          resCss = await minifyCss(resCss, { returnPromise: true })
        }
        this.emitFile({
          fileName: 'css/style.css',
          type: 'asset',
          source: resCss
        })
      }
    }
  }
}

async function compileCss(
  id: string,
  raw: string,
  cssOps: ICssOps
): Promise<{
  code: string
  map?: SourceMap
  ast?: Postcss.Result
  modules?: Record<string, string>
  deps?: Set<string>
}> {
  const {
    preprocessorOptions = {},
    modules: cssModulesOps = {},
    postcss: postcssOps = {}
  } = cssOps
  const lang = id.match(cssLangRE)?.[1]
  const isModule = cssModuleRE.test(id)
  const needInlineImport = raw.includes('@import')

  logger.debug(`pre info lang,isModule,needInlineImport:`)
  logger.debug(lang, isModule, needInlineImport)
  // 1. css to return
  if (lang === 'css' && !needInlineImport) {
    return {
      code: raw
    }
  }

  // 2. pre-processor
  let map: SourceMap | undefined
  let modules: Record<string, string> | undefined
  const deps = new Set<string>()
  if (lang && lang in preProcessorsMap) {
    const preProcessor = preProcessorsMap[lang as 'sass']
    let ops = {
      ...(preprocessorOptions?.[lang] || {}),
      filename: cleanUrl(id)
    }
    // support @import from node dependencies by default
    switch (lang) {
      case 'scss':
      case 'sass':
        ops = {
          includePaths: ['node_modules'],
          ...ops
        }
        break
      case 'less':
      case 'styl':
      case 'stylus':
        ops = {
          paths: ['node_modules'],
          ...ops
        }
    }
    const result = await preProcessor(raw, process.cwd(), ops)
    if (result.errors.length > 0) {
      logger.debug(`pre-processor error: `)
      logger.debug(result.errors)
      throw result.errors[0]
    }
    logger.debug(`pre-processor result:`)
    logger.debug(result.code)

    raw = result.code.toString()
    map = result?.map as SourceMap

    if (result.deps) {
      result.deps.forEach((dep) => {
        // sometimes sass registers the file itself as a dep
        if (dep !== ops.filename) {
          deps.add(dep)
        }
      })
    }
  }

  // 3. postcss
  const plugins = postcssOps?.plugins ? [...postcssOps.plugins] : []
  delete postcssOps?.plugins
  if (needInlineImport) {
    // @ts-ignore
    plugins.unshift((await import('postcss-import')).default())
  }
  if (isModule) {
    plugins.push(
      // @ts-ignore
      (await import('postcss-modules')).default({
        ...cssModulesOps,
        getJSON(
          _cssFileName: string,
          _modules: Record<string, string>,
          outFilename: string
        ) {
          modules = _modules
          if (cssModulesOps?.getJSON) {
            cssModulesOps.getJSON(_cssFileName, _modules, outFilename)
          }
        }
      })
    )
  }

  if (plugins.length < 1) {
    return {
      code: raw,
      map
    }
  }

  const postcssResult = await (await import('postcss'))
    .default(plugins)
    .process(raw, {
      ...postcssOps,
      to: id,
      from: id,
      map: {
        inline: false,
        annotation: false,
        prev: map
      }
    })

  logger.debug(`postcss result: `)
  logger.debug(postcssResult.css)

  return {
    ast: postcssResult,
    code: postcssResult.css,
    map: postcssResult.map as any,
    modules,
    deps
  }
}

async function processCssChunk(
  css: string,
  { minify }: { inject: boolean; minify: boolean }
) {
  let res = css
  // replace assets mark
  // if(inject) {}

  // do minify
  if (minify) {
    res = await minifyCss(res, { returnPromise: true })
  }
  return res
}

let CleanCSS: typeof CleanCss
async function minifyCss(css: string, ops: CleanCss.OptionsPromise) {
  CleanCSS = CleanCSS || (await import('clean-css')).default
  const res = await new CleanCSS({
    rebase: false,
    ...ops
  }).minify(css)

  if (res.errors && res.errors.length) {
    logger.error(chalk.red(`error when minifying css:\n${res.errors}`))
    throw res.errors[0]
  }

  // do not warn on remote @imports
  const warnings =
    res.warnings &&
    res.warnings.filter((m: string) => !m.includes('remote @import'))
  if (warnings && warnings.length) {
    logger.warn(
      chalk.yellow(`warnings when minifying css:\n${warnings.join('\n')}`)
    )
  }

  return res.styles
}

// Preprocessor support. This logic is from @vue/compiler-sfc & vite
type IPreprocessLang = 'less' | 'sass' | 'scss' | 'styl' | 'stylus'

type IPreprocessorResult = {
  code: string
  map?: Record<any, any>
  deps: string[]
  errors: RollupError[]
}

interface IPreprocessorHandleOps {
  filename: string
  [key: string]: any
}

type IPreprocessor = (
  source: string,
  root: string,
  ops: IPreprocessorHandleOps
) => Promise<IPreprocessorResult>

const loadedPreprocessors: Partial<Record<IPreprocessLang, IPreprocessor>> = {}

function loadPreprocessor(lang: IPreprocessLang, root: string) {
  if (lang in loadedPreprocessors) {
    return loadedPreprocessors[lang]
  }
  try {
    const resolved = require.resolve(lang, { paths: [root] })
    return (loadedPreprocessors[lang] = require(resolved))
  } catch (e) {
    throw new Error(
      `Preprocessor dependency "${lang}" not found. Did you install it?`
    )
  }
}

// sass scss
const scss: IPreprocessor = async (source, root, ops) => {
  const render = loadPreprocessor('sass', root).render as typeof Sass.render
  try {
    const result = await new Promise<Sass.Result>((resolve, reject) => {
      render(
        {
          ...ops,
          data: source,
          file: ops.filename
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
    })
    return {
      code: result.css.toString(),
      errors: [],
      deps: result.stats.includedFiles
    }
  } catch (e) {
    e.id = e.file
    e.frame = e.formatted
    return { code: '', errors: [e], deps: [] }
  }
}

const sass: IPreprocessor = async (source, root, ops) =>
  scss(source, root, { ...ops, indentedSyntax: true })

// less
const less: IPreprocessor = async (source, root, ops) => {
  const nodeLess = loadPreprocessor('less', root) as typeof Less
  try {
    const result = await nodeLess.render(source, {
      ...ops
    })

    return {
      code: result.css.toString(),
      deps: result.imports,
      errors: []
    }
  } catch (e) {
    const error = e as Less.RenderError
    // normalize error info
    const normalizedError: RollupError = new Error(error.message || error.type)
    normalizedError.loc = {
      file: error.filename || ops.filename,
      line: error.line,
      column: error.column
    }
    return { code: '', errors: [normalizedError], deps: [] }
  }
}

// stluy
const styl: IPreprocessor = (source, root, options) => {
  const nodeStylus = loadPreprocessor('stylus', root)
  return new Promise((resolve, reject) => {
    try {
      const ref = nodeStylus(source)
      Object.keys(options).forEach((key) => ref.set(key, options[key]))

      const result = ref.render()
      const deps = ref.deps()

      resolve({ code: result, errors: [], deps })
    } catch (e) {
      reject({ code: '', errors: [e], deps: [] })
    }
  })
}

const preProcessorsMap = {
  less,
  sass,
  scss,
  styl,
  stylus: styl
}
