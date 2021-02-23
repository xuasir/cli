import { createPlugin } from '@xus/cli'
import { Methods } from './types'

export default createPlugin({
  name: 'rollup:bundler',
  enforce: 'pre',
  apply(api) {
    api.registerMethod({
      methodName: Methods.ModifyRollupConfig,
      throwOnExist: false
    })
  }
})
