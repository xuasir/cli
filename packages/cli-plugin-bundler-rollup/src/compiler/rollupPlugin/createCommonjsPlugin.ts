import type { CompileMode } from '../../types'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import nodeBuiltins from 'rollup-plugin-node-builtins'
// import nodeGlobals from 'rollup-plugin-node-globals'

export const createCommonjsPlugin = ({ isCJS }: CompileMode) => {
  if (!isCJS) {
    return [
      nodeResolve({
        preferBuiltins: true
      }),
      commonjs({ sourceMap: false })
      // nodeGlobals(),
      // nodeBuiltins()
    ]
  }
  return []
}
