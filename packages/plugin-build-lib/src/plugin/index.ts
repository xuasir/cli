import type { IBundler } from './types'
import { createPlugin, HookTypes } from '@xus/cli'
import { Methods } from './enum'

export default createPlugin({
  name: 'build:lib',
  apply(api) {
    // global method
    api.registerMethod({
      methodName: Methods.ModifyLibBundler,
      throwOnExist: false
    })
    api.registerMethod({
      methodName: Methods.OnLibBuildSucceed,
      throwOnExist: false
    })
    api.registerMethod({
      methodName: Methods.OnLibBuildFailed,
      throwOnExist: false
    })
    api.registerMethod({
      methodName: Methods.RunBuild,
      throwOnExist: false,
      fn: async () => {
        // get lib bundler
        const LibBundler = await api.applyHook<IBundler>({
          name: Methods.ModifyLibBundler,
          type: HookTypes.serial
        })

        const libBundler = new LibBundler(api)

        try {
          const stats = await libBundler.build()
          await api.applyHook({
            name: Methods.OnLibBuildSucceed,
            type: HookTypes.event,
            args: stats
          })
        } catch (e) {
          await api.applyHook({
            name: Methods.OnLibBuildFailed,
            type: HookTypes.event,
            args: e
          })
        }
      }
    })
  }
})
