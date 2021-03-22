import { IPlugin } from '@xus/cli-types'
import { legacyPlugin } from './plugin'

export interface ILegacyOps {
  targets?: string | string[]
  helper?: 'bundled' | 'runtime'
}

export default (ops?: ILegacyOps) => {
  const { helper = 'runtime', targets = 'defaults' } = ops || {}
  return {
    name: 'xus:lib:legacy',
    apply(api) {
      // ensure minify is not esbuild
      api.onSetuped((config) => {
        const minify = config?.libBuild?.minify
        if (minify === 'esbuild') {
          throw new Error(
            `when use @xus/plugin-lib-legacy, minify should be use 'terser'!!! now is 'esbuild'.`
          )
        }
      })

      api.modifyRollupConfig({
        fn(rc) {
          // babel
          rc.plugin('$$legacy')
            .use(legacyPlugin, {
              helper,
              targets,
              sourceMaps: !!api.projectConfig?.libBuild?.sourcemap
            })
            .before('$$minify')

          return rc
        },
        stage: 200
      })
    }
  } as IPlugin
}
