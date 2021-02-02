import type { IPluginAPI } from '@xus/cli'
import type { OutputOptions, RollupOptions } from 'rollup'
import type {
  RollupConfig,
  FinalArgs,
  OverridesFn,
  CompileMode,
  Modes,
  CompileFormats
} from '../types'
import { rollup } from 'rollup'
import { formats } from '../utils'
import { defaultRollupConfig } from '../options'
import { createAliasAndReplacePlugin } from '../compiler/rollupPlugin'

class RollupManager {
  rollupOverrideFns: OverridesFn[] = []
  config: RollupConfig = {}
  api: IPluginAPI
  constructor(api: IPluginAPI) {
    this.api = api
  }

  // merge args
  setup(userRollupConfig: RollupConfig, args: FinalArgs): void {
    const finalConfig = Object.assign(
      {},
      defaultRollupConfig(),
      userRollupConfig
    )
    mergeArgs(finalConfig, args)
    this.config = finalConfig
  }

  // compoose override func
  private overrideRollup(...overrides: OverridesFn[]): OverridesFn {
    // 1. sort addOptiosnFn
    // 2. compoose addOptiosnFn
    return overrides.reduce(
      (left, right) => {
        return (config, mode) => right(left(config, mode), mode)
      },
      (config) => config
    )
  }
  // for compiler
  registerOverrideFn(...override: OverridesFn[]): void {
    this.rollupOverrideFns.push(this.overrideRollup(...override))
  }
  // for user config
  private setupUserRollupOverride(): void {
    const userOverrides = this.config?.overrides
    if (userOverrides) this.registerOverrideFn(...userOverrides)
  }
  // alias and replace
  private setAliasAndReplacePlugin(): void {
    this.registerOverrideFn(...createAliasAndReplacePlugin(this.config))
  }

  private normalizeInputAndOutput(
    rollupOps: RollupOptions,
    format: Modes
  ): void {
    const output = rollupOps?.output as OutputOptions
    const outFormat: CompileFormats = format === 'browsers' ? 'iife' : format
    // TODO: support multi entry
    if (output) {
      output.format = outFormat
    } else {
      rollupOps.output = {
        file: this.api.PathManager.getPath(`lib/index.${format}.js`),
        format: outFormat
      }
    }
  }

  private resolveModeEnv(mode: Modes): CompileMode {
    const baseMode: CompileMode = {
      isESM: false,
      isBrowsers: false,
      isCJS: false,
      isUMD: false
    }
    switch (mode) {
      case 'esm':
        baseMode.isESM = true
        break

      case 'cjs':
        baseMode.isCJS = true
        break

      case 'umd':
        baseMode.isUMD = true
        break

      case 'browsers':
        baseMode.isBrowsers = true
        break
    }

    return baseMode
  }
  // get final config
  resolveRollupConfig(): RollupOptions[] {
    const { formats = [] } = this.config
    delete this.config.formats
    const configs: RollupOptions[] = []
    ;(formats as Array<Modes>).forEach((format) => {
      const finalConfig = this.rollupOverrideFns.reduce(
        (left, right) => {
          return (config, mode) => right(left(config, mode), mode)
        },
        (config) => config
      )(this.config, this.resolveModeEnv(format))
      // gen output
      this.normalizeInputAndOutput(finalConfig, format)
      configs.push(finalConfig)
    })
    return configs
  }

  async build() {
    // user override fn
    this.setupUserRollupOverride()
    // add alias and replace plugin
    this.setAliasAndReplacePlugin()
    // get final configs
    const rollupConfigs = this.resolveRollupConfig()
    // run build
    for (const config of rollupConfigs) {
      const output = config.output as OutputOptions
      delete config.output
      // set env
      this.api.EnvManager.babelEnv =
        output.format === 'iife' ? 'browsers' : output.format
      console.log(`build for ${output.format} ...`)
      const bundle = await rollup(config)
      console.log(`write for ${output.format} ...`)
      await bundle.write(output)
      console.log(`build ${output.format} success`)
    }
  }
}

function mergeArgs(config: RollupConfig, args: FinalArgs) {
  if (args?.input) {
    config.input = args.input
  }
  if (args?.formats) {
    config.formats = args.formats.split(',').filter((f) => formats.includes(f))
  }
}

export type IRollupManager = InstanceType<typeof RollupManager>

export default RollupManager

export * from './overrides'
