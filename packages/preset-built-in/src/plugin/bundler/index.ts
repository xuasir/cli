import { createPlugin } from '@xus/cli-types'
import { HookTypes } from '@xus/core'
import { BundlerMethods } from './enum'
// chain
import rollupChain from '@xus/rollup-chain'
import webpackChain from 'webpack-chain'

const PluginName = 'xus:bundler:rollup'
export default createPlugin({
  name: PluginName,
  apply(api) {
    // rollup config
    api.registerMethod({
      methodName: BundlerMethods.modifyRollupConfig,
      throwOnExist: false
    })
    api.registerMethod({
      methodName: BundlerMethods.getRollupConfig,
      throwOnExist: false,
      fn: async (arg?: any) => {
        const rc = new rollupChain()
        await api.applyHook({
          name: BundlerMethods.modifyRollupConfig,
          type: HookTypes.serial,
          initialValue: rc,
          args: arg
        })
        return rc.toConfig()
      }
    })
    // webpack config
    api.registerMethod({
      methodName: BundlerMethods.modifyWebpackConfig,
      throwOnExist: false
    })
    api.registerMethod({
      methodName: BundlerMethods.getWebpackConfig,
      throwOnExist: false,
      fn: async (arg?: any) => {
        const wr = new webpackChain()
        await api.applyHook({
          name: BundlerMethods.modifyWebpackConfig,
          type: HookTypes.serial,
          initialValue: wr,
          args: arg
        })
        return wr.toConfig()
      }
    })
  }
})
