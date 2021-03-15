import { Plugin } from 'rollup'
import * as babel from '@babel/core'
import jsx3, { VueJSXPluginOptions } from '@vue/babel-plugin-jsx'
// @ts-ignore
import jsx2 from '@vue/babel-preset-jsx'

export interface IVueJsx {
  version?: 2 | 3
  jsxOps?: VueJSXPluginOptions | Record<string, any>
  sourceMaps?: boolean
}

const filterRE = /\.[jt]sx$/
const tsRE = /\.tsx$/

export function vuejsx(ops?: IVueJsx): Plugin {
  const { version = 3, jsxOps = {}, sourceMaps = false } = ops || {}
  return {
    name: 'xus:vuejsx',
    async transform(code, id) {
      if (filterRE.test(id)) {
        const presets = []
        const plugins = []
        if (version === 3) {
          plugins.push([jsx3, jsxOps])
        } else {
          presets.push([jsx2, jsxOps])
        }
        if (tsRE.test(id)) {
          plugins.push([
            // @ts-ignore
            await import('@babel/plugin-transform-typescript'),
            { isTSX: true, allowExtensions: true }
          ])
        }
        // ready to transform
        const res = babel.transformSync(code, {
          ast: true,
          presets,
          plugins,
          sourceFileName: id,
          sourceMaps,
          babelrc: false,
          configFile: false
        })
        return {
          code: res!.code!,
          map: res!.map
        }
      }
      return null
    }
  }
}
