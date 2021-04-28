import { Logger } from '@xus/cli-shared'
import { Plugin } from 'rollup'
import * as babel from '@babel/core'
// @ts-ignore
import preset from '@xus/babel-preset'

interface ILegacyPluginOps {
  targets?: string | string[] | { browsers: string[] } | Record<string, string>
  helper?: 'bundled' | 'runtime'
  sourceMaps?: boolean
  useDynamicImport?: boolean
}

const logger = new Logger(`xus:rollup:legacy`)

export function legacyPlugin(ops?: ILegacyPluginOps): Plugin {
  const { sourceMaps = false, targets, useDynamicImport = false } = ops || {}
  return {
    name: 'xus:rollup:legacy',
    async transform(code, filename) {
      if (/.js$/.test(filename)) {
        const presets = [
          [
            preset,
            {
              targets,
              modules: false,
              useESModules: true,
              absoluteRuntime: false,
              useDynamicImport
            }
          ]
        ]
        const res = babel.transform(code, {
          ast: true,
          presets,
          sourceMaps,
          babelrc: false,
          configFile: false,
          filename,
          minified: false,
          compact: false
        })
        logger.debug(`transform code: `)
        logger.debug(res)
        return {
          code: res!.code!,
          map: res!.map
        }
      }
      return null
    },
    async renderChunk(code, chunk, ops) {
      // trun off esbuild transform .js file
      // @ts-ignore
      ops.__xus__skip__esbuild = true
      return null
    }
  }
}
