import { createPlugin } from '@xus/cli'
import { BundlerRollupMethods } from './types'
import RollupBundler from './rollupBundler'

export default createPlugin({
  name: 'bundler:rollup',
  apply(api) {
    api.registerMethod({
      methodName: BundlerRollupMethods.ModifyRollupConfig,
      throwOnExist: false
    })
    api.modifyLibBundler(() => RollupBundler)
  }
})
