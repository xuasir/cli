import { createPlugin } from '@xus/cli'
import { createTemp } from './create'

export default createPlugin({
  name: 'cmd:create',
  apply(api) {
    api.registerCommand(
      'create',
      {
        desc: 'create template project',
        usage: 'xus create [dir]',
        options: {
          '--template': 'point a template',
          '-t': 'point a template short option'
        }
      },
      async (args) => {
        await createTemp(args, api)
      }
    )
  }
})
