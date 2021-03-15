import { Plugin } from 'rollup'
import { TransformOptions } from 'esbuild'
import { transformByEsbuild } from './esbuild'
import terser, { MinifyOptions } from 'terser'

export interface IMinifyOps {
  minify?: false | 'esbuild' | 'terser'
  esbuildMinifyOps?: TransformOptions
  terserMinifyOps?: MinifyOptions
}

export function minifyPlugin(ops: IMinifyOps = {}): Plugin {
  return {
    name: 'xus:minify',
    async renderChunk(source, chunk, outputOps) {
      switch (ops.minify) {
        case false:
          return null

        case 'esbuild':
          return await transformByEsbuild(source, chunk.fileName, {
            ...ops.esbuildMinifyOps,
            minify: true
          })

        case 'terser':
          // eslint-disable-next-line no-case-declarations
          const res = await terser.minify(source, {
            ...ops.terserMinifyOps,
            module: outputOps.format.startsWith('es'),
            toplevel: outputOps.format === 'cjs',
            safari10: true
          })
          return {
            code: res.code as string,
            map: res.map
          }
      }
      return null
    }
  }
}
