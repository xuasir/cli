import { createPlugin, HookTypes, rimraf } from '@xus/cli'
import { existsSync } from 'fs'
import { join, relative } from 'path'

export default createPlugin({
  name: 'cmd:clean',
  apply(api) {
    api.registerCommand(
      'clean',
      {
        desc: 'a command for clean dir',
        options: {
          '--dirOrFile': 'point need to clean dir or file name',
          '--skip':
            'use RegExp to skip some packages/** dir name in lerna project',
          '--point': 'use RegExp to point packages/** dir name in lerna project'
        }
      },
      async (args) => {
        if (args.dirOrFile) {
          const skipRE = args?.skip ? new RegExp(args.skip) : false
          const pointRE = args?.point ? new RegExp(args.point) : false

          ;(args.dirOrFile as string)
            .split(',')
            .map((dir) => [
              api.getPathBasedOnCtx(dir),
              ...api
                .getLernaPkgs()
                .filter((pkg) => {
                  const relativePkg = relative(api.cwd, pkg)
                  if (skipRE && skipRE.test(relativePkg)) return false
                  if (pointRE && !pointRE.test(relativePkg)) return false
                  return true
                })
                .map((pkg) => join(pkg, dir))
            ])
            .flat()
            .filter((dirPath) => existsSync(dirPath))
            .forEach((dir) => {
              api.registerHook({
                name: `remove.dir`,
                pluginName: 'cmd:clean',
                fn: () => {
                  rimraf.sync(dir)
                }
              })
            })

          try {
            await api.applyHook({
              name: 'remove.dir',
              type: HookTypes.parallel
            })
            api.logger.success(`clean dir or file succeed`)
          } catch (e) {
            api.logger.error(`clean dir or file failed, ${e.massage}`)
          }
        }
      }
    )
  }
})
