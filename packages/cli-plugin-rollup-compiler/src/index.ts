import type { IPluginAPI, ProjectConfig } from '@xus/cli'
import type {
  RollupPluginConfig,
  CompileTargets
} from '@xus/cli-plugin-bundler-rollup'
import type { FinalArgs } from './types'
import { error } from '@xus/cli'
import chalk from 'chalk'
import { build, Cmds, commands } from './commands'

export default function (api: IPluginAPI, projectConfig: ProjectConfig): void {
  api.registerCommand(
    'rollup-js',
    {
      usage: 'xus rollup <command> [options]',
      desc: 'a js/ts/react/vue bundler based on rollup',
      options: {
        vue: 'rollup vue based on js',
        react: 'rollup react based on js',
        '--targets': 'point build target',
        '--sourcemap': 'generate sourcemap',
        '--prod': 'able production'
      }
    },
    async (args: FinalArgs) => {
      // valid buildCmd
      const buildCmd: Cmds = (args._.shift() || 'js') as Cmds
      if (!buildCmd || !commands.includes(buildCmd)) {
        error(
          `\n  invalid command: ${chalk.red(buildCmd)}` +
            `\n  support commands: ${chalk.green(
              `${commands.filter((cmd) => cmd != 'js').join(' / ')}`
            )}\n`
        )
        process.exit(1)
      }
      if (args?.prod) {
        // set env
        api.EnvManager.mode = 'production'
      } else {
        api.EnvManager.mode = 'development'
      }
      // handle of options
      if (args?.sourcemap) {
        api.RollupManager.registerChainFn((rollupChain) => {
          rollupChain.when('all').output.sourcemap(true)
        })
      }
      // handle of plugin config
      const rollupPluginConfig = projectConfig?.pluginOps?.rollup || {}
      if (args?.targets) {
        ;(rollupPluginConfig as RollupPluginConfig).targets = args.targets.split(
          ','
        ) as CompileTargets[]
      }
      api.RollupManager.setup(rollupPluginConfig)

      return build(buildCmd, api).catch((err) => {
        console.info(`${chalk.red(err)}`)
      })
    }
  )
}
