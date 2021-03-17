/**
 * https://github.com/rollup/plugins/blob/master/packages/json/src/index.js
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file at
 * https://github.com/rollup/plugins/blob/master/LICENSE
 */
import { Logger } from '@xus/cli-shared'
import { Plugin } from 'rollup'
import { dataToEsm } from '@rollup/pluginutils'

export interface IJsonOps {
  exportMode?: 'named' | 'stringify'
}

const logger = new Logger(`xus:rollup:json`)
const jsonRE = /\.json($|\?)(?!commonjs-proxy)/

// named or stringify
export function jsonPlugin(ops?: IJsonOps): Plugin {
  const { exportMode = 'stringify' } = ops || {}
  return {
    name: 'xus:rollup:json',
    transform(json, id) {
      if (jsonRE.test(id)) {
        logger.debug(`transform json file ${id} by ${exportMode}`)
        try {
          if (exportMode === 'stringify') {
            return {
              code: `export default JSON.parse(${JSON.stringify(
                JSON.stringify(JSON.parse(json))
              )})`,
              map: { mappings: '' }
            }
          } else {
            const parsed = JSON.parse(json)
            return {
              code: dataToEsm(parsed, {
                preferConst: true,
                namedExports: true
              }),
              map: { mappings: '' }
            }
          }
        } catch (e) {
          const errorMessageList = /[\d]+/.exec(e.message)
          const position = errorMessageList && parseInt(errorMessageList[0], 10)
          const msg = position
            ? `, invalid JSON syntax found at line ${position}`
            : `.`
          this.error(`Failed to parse JSON file` + msg, e.idx)
        }
      }
    }
  }
}
