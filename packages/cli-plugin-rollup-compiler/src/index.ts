import type { IPluginAPI, ProjectConfig } from '@xus/cli'
import type {
  RollupPluginConfig,
  CompileTargets
} from '@xus/cli-plugin-bundler-rollup'
import type { FinalArgs } from './types'
import chalk from 'chalk'
import { error } from '@xus/cli'
import { compileCmds } from './compiler'
import { build } from './commands'

export default function (api: IPluginAPI, projectConfig: ProjectConfig): void {
  api.registerCommand(
    'rollup',
    {
      usage: 'xus rollup <command> [options]',
      desc: 'a js/ts/react/vue bundler based on rollup',
      options: {
        '--targets': 'point build target',
        '--sourcemap': 'generate sourcemap',
        '--prod': 'able production'
      }
    },
    async (args: FinalArgs) => {
      // valid buildCmd
      const buildCmd = args._.shift()
      if (!buildCmd || !compileCmds.includes(buildCmd)) {
        error(
          `\n  invalid command: ${chalk.red(buildCmd)}` +
            `\n  support commands: ${chalk.green(
              `${compileCmds.join(' / ')}`
            )}\n`
        )
        process.exit(1)
      }
      // set env
      if (args?.prod) {
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
