import type { IPluginAPI } from '@xus/cli'
import type { FinalConfig, FinalArgs } from './types'
import chalk from 'chalk'
import { error } from '@xus/cli'
import { compileCmds } from './compiler'
import { rollupSchema } from './options'
import { build } from './commands'
import RollupManager from './rollupManager'

export default function (api: IPluginAPI, projectConfig: FinalConfig): void {
  // config validator
  api.registerConfigValidator('rollup', rollupSchema)
  api.registerCommand(
    'rollup',
    {
      usage: 'xus rollup <command> [options]',
      desc: 'a js/ts/react/vue bundler based on rollup',
      options: {
        '--input': 'point rollup build entry',
        '--formats': 'point build format'
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
      // 1. init rollupManager
      const rollupManager = new RollupManager(api)
      // 2. merge args config
      rollupManager.setup(projectConfig?.pluginOps?.rollup || {}, args)
      // 3. build
      return build(buildCmd, rollupManager, api).catch((err) => {
        error(`\nbuild failed` + `\n${err}`)
      })
    }
  )
}
