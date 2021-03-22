import { IPlugin } from '@xus/cli-types'
import { vuejsx, IVueJsx } from './plugin'

export interface IVueJsxOps {
  version?: 2 | 3
  jsxOps?: IVueJsx['jsxOps']
}

export default (ops?: IVueJsxOps) => {
  const { version = 3, jsxOps = {} } = ops || {}
  return {
    name: 'xus:lib:vuejsx',
    apply(api) {
      api.modifyRollupConfig({
        fn(rc) {
          rc.plugin('$$esbuild').tap((ops) => {
            // turn esbuild only handle .ts file
            ops.include = /\.ts$/
            return ops
          })
          // vue jsx transform
          rc.plugin('vuejsx').use(vuejsx, {
            version,
            jsxOps,
            sourceMaps: !!api.projectConfig?.libBuild?.sourcemap
          })
          return rc
        },
        // last to run
        stage: 100
      })
    }
  } as IPlugin
}
