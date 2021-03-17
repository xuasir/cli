import { Logger } from '@xus/cli-shared'
import { Plugin } from 'rollup'
import * as babel from '@babel/core'
// @ts-ignore
import preset from '@xus/babel-preset'

interface ILegacyPluginOps {
  targets?: string | string[]
  helper?: 'bundled' | 'runtime'
  sourceMaps?: boolean
}

const logger = new Logger(`xus:rollup:legacy`)

export function legacyPlugin(ops?: ILegacyPluginOps): Plugin {
  const { helper = 'runtime', sourceMaps = false, targets = 'defaults' } =
    ops || {}
  return {
    name: 'xus:rollup:legacy',
    async renderChunk(code, chunk, ops) {
      // trun off esbuild transform .js file
      // @ts-ignore
      ops.__xus__skip__esbuild = true
      logger.debug(`transform ${chunk.facadeModuleId}`)
      const presets = [
        [
          preset,
          {
            targets,
            modules: false,
            useESModules: true,
            usageMode:
              helper === 'bundled' || ['iife', 'umd'].includes(ops.format),
            absoluteRuntime: false
          }
        ]
      ]
      const res = babel.transform(code, {
        ast: true,
        presets,
        sourceMaps,
        inputSourceMap: chunk.map,
        babelrc: false,
        configFile: false,
        filename: chunk.fileName,
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
  }
}
