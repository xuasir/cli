import { Logger } from '@xus/cli-shared'
import { Plugin } from 'rollup'
import { TransformOptions } from 'esbuild'
import { transformByEsbuild } from './esbuild'
import terser, { MinifyOptions } from 'terser'

export interface IMinifyOps {
  minify?: false | 'esbuild' | 'terser'
  esbuildMinifyOps?: TransformOptions
  terserMinifyOps?: MinifyOptions
}

const logger = new Logger(`xus:rollup:minify`)

export function minifyPlugin(ops?: IMinifyOps): Plugin {
  const { minify = false, esbuildMinifyOps = {}, terserMinifyOps = {} } =
    ops || {}
  const isEsbuildMinify = minify === 'esbuild'
  return {
    name: 'xus:minify',
    async renderChunk(source, chunk, outputOps) {
      logger.debug(`minify ${chunk.fileName} transformer ${minify}`)

      let code = source
      let map = chunk.map
      // when legacy mode skip esbuild handle use babel
      // @ts-ignore
      if (!outputOps?.__xus__skip__esbuild) {
        // transform js, minify when minify === esbuild
        logger.debug(`esbuild minify with `, {
          ...esbuildMinifyOps,
          minify: isEsbuildMinify
        })
        const result = await transformByEsbuild(source, chunk.fileName, {
          ...esbuildMinifyOps,
          minify: isEsbuildMinify
        })
        code = result.code
        map = result.map
        logger.debug(`esbuild minify warning `, result.warnings)
      }

      if (minify === 'terser') {
        // eslint-disable-next-line no-case-declarations
        const res = await terser.minify(code, {
          ...terserMinifyOps,
          sourceMap: !!outputOps.sourcemap,
          module: outputOps.format.startsWith('es'),
          toplevel: outputOps.format === 'cjs',
          safari10: true
        })
        return {
          code: res.code as string,
          map: res.map
        }
      } else {
        return {
          code,
          map
        }
      }
    }
  }
}
