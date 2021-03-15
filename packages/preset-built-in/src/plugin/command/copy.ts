import { createPlugin } from '@xus/cli-types'
import { copy, Spinner } from '@xus/cli-shared'
import { existsSync } from 'fs'
import { join } from 'path'

const spinner = new Spinner()

export default createPlugin({
  name: 'cmd:copy',
  apply(api) {
    api.registerCommand(
      'copy',
      {
        desc: 'a command for copy dir',
        usage: `xus copy --src src --dest dest`,
        options: {
          '--src': 'copy from',
          '--dest': 'copy to'
        }
      },
      (args) => {
        if (args?.src && args?.dest) {
          const src = join(api.cwd, args?.src)
          const dest = join(api.cwd, args?.dest)
          if (existsSync(src)) {
            api.logger.info(`Copy ${src} --> ${dest}`)
            spinner.start(`copy start`)
            try {
              copy(src, dest)
              spinner.succeed(`copy succeed`)
            } catch (error) {
              api.logger.error(error)
              spinner.failed(`copy failed`)
            }
          } else {
            api.logger.wran(`src ${src} not exists`)
          }
        }
      }
    )
  }
})
