import { createPlugin, runCmd } from '@xus/cli'
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
            const ext =
              eslint.ext.length > 0
                ? eslint.ext
                : ['.js', '.jsx', '.ts', '.tsx', '.vue']
            const args = [
              eslint.include,
              '--fix',
              '--ext',
              ext.join(',')
            ].filter(Boolean)
            api.logger.debug(`run eslint with `)
            api.logger.debug(args)
            eslintRes = await runCmd('eslint', args, {
              start: 'Running eslint',
              succeed: 'Eslint Passed',
              failed: 'Eslint failed'
            })
          }
        }

        if (lintConfig.stylelint) {
          const stylelint = lintConfig.stylelint
          if (typeof stylelint != 'boolean') {
            const include =
              stylelint.include.length > 0
                ? stylelint.include
                : ['./**/*.css', './**/*.vue', './**/*.less', './**/*.sass']
            const args = include.concat(['--fix'])
            api.logger.debug(`run stylelint with `)
            api.logger.debug(args)
            stylelintRes = await runCmd('stylelint', args, {
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
