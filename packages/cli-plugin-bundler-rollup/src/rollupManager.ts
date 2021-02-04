import type { IPluginAPI } from '@xus/cli'
import type { IRollupChain, AllConfigs } from './rollupChian'
import type { ChainFn, RollupPluginConfig, CompileTargets } from './types'
import { Target2Format } from './types'
import { rollup } from 'rollup'
import { terser } from 'rollup-plugin-terser'
import chalk from 'chalk'
import { warn, logWithSpinner, succeedSpinner, failSpinner } from '@xus/cli'
import RollupChain from './rollupChian'
import rollupValidator from './validator'
import { defaultRollupConfig } from './options'

class RollupManager {
  private rollupChain: IRollupChain
  private chainFns: ChainFn[] = []
  private rollupPluginConfig!: RollupPluginConfig

  constructor() {
    this.rollupChain = new RollupChain()
    this.initFormat()
  }

  private initFormat() {
    this.rollupChain
      .when('esm-browser')
      .output.format(Target2Format['esm-browser'])
      .end()
      .end()
      .when('esm-bundler')
      .output.format(Target2Format['esm-bundler'])
      .end()
      .end()
      .when('global')
      .output.format(Target2Format['global'])
      .end()
      .end()
      .when('node')
      .output.format(Target2Format['node'])
      .end()
      .end()
  }

  // for plugin user
  setup(pluginConfig: Partial<RollupPluginConfig>) {
    // merge to default
    this.rollupPluginConfig = Object.assign(defaultRollupConfig(), pluginConfig)

    this.registerChainFn(this.rollupPluginConfig.chainRollup)
  }

  // for register
  registerChainFn(fn: ChainFn, prepend = false) {
    if (prepend) {
      this.chainFns.unshift(fn)
    } else {
      this.chainFns.push(fn)
    }
    return this
  }

  private setupProd(api: IPluginAPI) {
    if (api.EnvManager.mode === 'production') {
      this.registerChainFn((rollupChain) => {
        ;([
          'esm-browser',
          'esm-bundler',
          'node',
          'global'
        ] as CompileTargets[]).forEach((target) => {
          const file = rollupChain.when(target).output.get('file')
          if (file) {
            rollupChain
              .when(target)
              .output.file(file.replace(/\.js$/, '.prod.js'))
              .end()
              .plugin('terser')
              .use(terser, [
                {
                  module: /^esm/.test(target)
                }
              ])
          }
        })
      })
    }
  }

  private resloveConfigs() {
    this.chainFns.forEach((chainFn) => {
      chainFn(this.rollupChain)
    })
    return this.rollupChain.toConfig()
  }

  private validConfig(configs: AllConfigs) {
    ;(Object.keys(configs) as CompileTargets[]).forEach((prefix) => {
      const config = configs[prefix]
      config && rollupValidator(config, prefix)
    })
  }

  async build(api: IPluginAPI) {
    this.setupProd(api)
    const configs = this.resloveConfigs()
    this.validConfig(configs)
    const { targets } = this.rollupPluginConfig
    for (const target of targets) {
      const config = configs[target]
      if (!config) {
        warn(
          chalk.yellow(
            `build target ${target} has no rollup config, will be skip!!!`
          )
        )
        continue
      }
      // set bable env
      api.EnvManager.babelEnv = target
      // build
      const { output, ...bundleOps } = config
      logWithSpinner(chalk.yellow(`run ${target} build...`))
      console.info(chalk.blue(`\n${bundleOps.input} -> ${output.file}`))
      try {
        const bundle = await rollup(bundleOps)
        await bundle.write(output)
      } catch (error) {
        failSpinner(chalk.red(`build failed`))
        throw error
      }
      succeedSpinner(chalk.green(`${target} build success`))
    }
  }
}

export type IRollupManager = InstanceType<typeof RollupManager>

export default RollupManager
