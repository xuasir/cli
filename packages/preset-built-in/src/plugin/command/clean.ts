import { createPlugin, removeDirOrFile, emptyDir } from '@xus/cli'
import { existsSync } from 'fs'
import { join, relative } from 'path'

export default createPlugin({
  name: 'cmd:clean',
  apply(api) {
    api.registerCommand(
      'clean',
      {
        desc: 'a command for clean dir',
        usage: `xus clean --dirOrFile dist --point 'core|shared'`,
        options: {
          '--mode': 'empty or remove',
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
          api.logger.debug(`handle of dir `)
          const dirs = (args.dirOrFile as string)
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

          try {
            api.logger.debug(`clean dir or file ${dirs}`)
            const mode = args?.mode || 'remove'
            if (mode === 'remove') {
              await removeDirOrFile(dirs)
            } else if (mode === 'empty') {
              await Promise.all(dirs.map(emptyDir))
            }
            api.logger.success(`clean dir or file succeed`)
          } catch (e) {
            api.logger.error(`clean dir or file failed, ${e.massage}`)
          }
        }
      }
    )
  }
})
