import { Logger } from '@xus/cli-shared'
import { Plugin } from 'rollup'
import { createFilter } from '@rollup/pluginutils'
import * as esbuild from 'esbuild'
import { TransformOptions, Loader } from 'esbuild'
import { extname } from 'path'
import { cleanUrl } from '../utils'

const logger = new Logger('xus:rollup:esbuild')

interface IEsbuildOps extends TransformOptions {
  include?: RegExp
  exclude?: RegExp
  jsxInject?: string
}

export function esbuildPlugin(ops: IEsbuildOps = {}): Plugin {
  const filter = createFilter(
    ops?.include || undefined,
    ops?.exclude || undefined
  )
  delete ops?.include
  delete ops?.exclude

  return {
    name: 'xus:esbuild:transform',
    // tsx/ts/jsx -> js
    async transform(code, importer) {
      if (filter(importer)) {
        const jsxInject = ops?.jsxInject
        delete ops?.jsxInject
        logger.debug(`esbuild transform (${importer})`)
        logger.debug(`source code: `)
        logger.debug(code)
        const res = await transformByEsbuild(code, importer, ops)
        if (jsxInject && /\.(?:j|t)sx\b/.test(importer)) {
          res.code = jsxInject + ';' + res.code
        }
        return {
          code: res.code,
          map: res.map
        }
      }
      return null
    }
  }
}

export async function transformByEsbuild(
  source: string,
  filename: string,
  ops: TransformOptions
) {
  // get loader
  let ext = extname(
    /\.\w+$/.test(filename) ? filename : cleanUrl(filename)
  ).slice(1)
  if (ext === 'cjs' || ext === 'mjs') {
    ext = 'js'
  }
  const loader = ext as Loader
  // transform
  const transformOps: TransformOptions = {
    ...ops,
    sourcefile: filename,
    loader,
    sourcemap: true,
    minify: false
  }
  try {
    logger.debug(`transform with options: `)
    logger.debug(transformOps)
    const { code, map, warnings } = await esbuild.transform(
      source,
      transformOps
    )
    logger.debug(`transform code: `)
    logger.debug(code)
    logger.debug(`transform sourcemap: `)
    logger.debug(map)
    // log warn
    logger.debug(`transform warnnings: `)
    logger.debug(warnings)
    let warnMsg = ''
    warnings.forEach((w) => {
      warnMsg += w.text + '\n'
    })
    warnMsg && logger.warn('transform ' + filename + ' warnning:' + warnMsg)
    return {
      code,
      map: map ? JSON.parse(map) : {}
    }
  } catch (e) {
    logger.debug(`esbuild error: `)
    logger.debug(e)
    let errorMsg = ''
    e.errors.forEach((e: any) => {
      errorMsg += e.text + '\n'
    })
    logger.error(errorMsg)
    throw e
  }
}
