import type { IBundler, ILibBuildOps } from './types'
import { createPlugin, HookTypes, RollupBundler } from '@xus/cli'
import { BuildLibMethods } from './enum'

export default createPlugin({
  name: 'lib:build',
  apply(api) {
    // global method
    api.registerMethod({
      methodName: BuildLibMethods.ModifyLibBundler,
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
  }
})
