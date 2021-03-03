import type { IBundler, ILibBuildOps, ILibBuildTargets } from './types'
import RollupChain from '@xus/rollup-chain'
import { createPlugin, HookTypes } from '@xus/cli'
import { RollupBundler } from '../bundler'
import { defaultLibBuildConfig, libBuildSchema } from './config'
import { BuildLibMethods } from './enum'
import { getModifyConfigCtx } from './utils'

export default createPlugin({
  name: 'lib:build',
  enforce: 'pre',
  apply(api) {
    // global method
    // fast hook register method
    api.registerMethod({
      methodName: BuildLibMethods.ModifyLibBundler,
      throwOnExist: false
    })
    api.registerMethod({
      methodName: BuildLibMethods.ModifyRollupConfig,
      throwOnExist: false
    })
    api.registerMethod({
      methodName: BuildLibMethods.OnLibBuildSucceed,
      throwOnExist: false
    })
    api.registerMethod({
      methodName: BuildLibMethods.OnLibBuildFailed,
      throwOnExist: false
    })
    // quick get
    api.registerMethod({
      methodName: BuildLibMethods.GetRollupChainConfig,
      throwOnExist: false,
      fn: async (target: ILibBuildTargets) => {
        const rc = new RollupChain()
        return await api.applyHook({
          name: BuildLibMethods.ModifyRollupConfig,
          type: HookTypes.serial,
          initialValue: rc,
          args: getModifyConfigCtx(target)
        })
      }
    })
    api.registerMethod({
      methodName: BuildLibMethods.RunLibBuild,
      throwOnExist: false,
      fn: async (ops: ILibBuildOps) => {
        api.logger.debug(`get lib bundler: `)
        // get lib bundler
        const LibBundler = await api.applyHook<IBundler>({
          name: BuildLibMethods.ModifyLibBundler,
          type: HookTypes.serial,
          initialValue: RollupBundler
        })
        api.logger.debug(LibBundler)

        const libBundler = new LibBundler(api)

        try {
          const stats = await libBundler.build(ops)
          await api.applyHook({
            name: BuildLibMethods.OnLibBuildSucceed,
            type: HookTypes.event,
            args: stats
          })
        } catch (e) {
          await api.applyHook({
            name: BuildLibMethods.OnLibBuildFailed,
            type: HookTypes.event,
            args: e
          })
        }
      }
    })
  },
  config: {
    key: 'libBuild',
    default: defaultLibBuildConfig,
    schema: libBuildSchema
  }
})
