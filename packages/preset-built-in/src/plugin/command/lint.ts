import { createPlugin } from '@xus/cli-types'
import { runCmd } from '@xus/cli-shared'
import { lintSchema, defaultLitConfig } from '../config/lint'

export default createPlugin({
  name: 'cmd:lint',
  apply(api) {
    api.registerCommand(
      'lint',
      {
        desc: 'a command for lint js/css',
        usage: `xus lint `
      },
      async () => {
        const lintConfig = api.projectConfig.lint
        let eslintRes = true
        let stylelintRes = true
        if (lintConfig.eslint) {
          const eslint = lintConfig.eslint
          if (typeof eslint != 'boolean') {
            const cext = eslint?.ext || []
            const ic = eslint?.include || []
            const include = ic.length > 0 ? ic : []
            const ext =
              cext.length > 0 ? cext : ['.js', '.jsx', '.ts', '.tsx', '.vue']
            const args = [
              'eslint',
              '--fix',
              '--ext',
              ext.join(','),
              ...include
            ].filter(Boolean) as string[]
            api.logger.debug(`run eslint with `)
            api.logger.debug(args)
            eslintRes = await runCmd('npx', args, {
              start: 'Running eslint',
              succeed: 'Eslint Passed',
              failed: 'Eslint failed'
            })
          }
        }

        if (lintConfig.stylelint) {
          const stylelint = lintConfig.stylelint
          if (typeof stylelint != 'boolean') {
            const ic = stylelint?.include || []
            const include = ic.length > 0 ? ic : []
            // ['./**/*.css', './**/*.vue', './**/*.less', './**/*.sass']
            const args = ['stylelint', ...include].concat(['--fix'])
            api.logger.debug(`run stylelint with `)
            api.logger.debug(args)
            stylelintRes = await runCmd('npx', args, {
              start: 'Running stylelint',
              succeed: 'Stylelint Passed',
              failed: 'Stylelint failed'
            })
          }
        }

        // handle of res
        if (!eslintRes || !stylelintRes) {
          process.exit(1)
        }
      }
    )
  },
  config: {
    key: 'lint',
    default: defaultLitConfig,
    schema: lintSchema
  }
})
