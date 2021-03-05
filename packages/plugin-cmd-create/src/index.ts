import { createPlugin } from '@xus/cli'

export default createPlugin({
  name: 'cmd:create',
  apply(api) {
    api.registerCommand(
      'create',
      {
        desc: 'create template project',
        usage: 'xus create [dir]'
      },
      () => {
        //
      }
    )
  }
})
