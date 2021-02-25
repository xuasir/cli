import type { IPluginAPI, IBundlerImp, ILibBuildTargets } from '@xus/cli'
import type { IRollupChain } from './rollupChian'
import type { IRollupConfig } from './rollupChian/lib/types'
import type { IDoBuildOps } from './types'
import { relative } from 'path'
import { rollup } from 'rollup'
import { Logger, HookTypes, isLernaPkg, chalk } from '@xus/cli'
import { getModifyConfigCtx } from './utils'
import { BundlerRollupMethods } from './types'
import RollupChain from './rollupChian'
import rollupValidator from './validator'

const logger = new Logger(`xus:bundler:rollup`)
class RollupBundler implements IBundlerImp {
  private api

  constructor(api: IPluginAPI) {
    this.api = api
  }

  private async getConfig(target: ILibBuildTargets) {
    const rc = new RollupChain()
    // get final config
    const rollupChain = await this.api.applyHook<IRollupChain>({
      name: BundlerRollupMethods.ModifyRollupConfig,
      type: HookTypes.serial,
      initialValue: rc,
      args: getModifyConfigCtx(target)
    })

    logger.debug(`apply modify rollup config hook success`)

    return rollupChain.toConfig()
  }

  private validConfig(config: IRollupConfig) {
    rollupValidator(config)
  }

  async build(
    ops = {
      targets: ['esm', 'cjs', 'browser'],
      watch: false,
      pointPkg: ''
    }
  ) {
    const { targets, ...rest } = ops
    for (const target of targets as ILibBuildTargets[]) {
      if (isLernaPkg(this.api.cwd)) {
        return await this.doBuildForLerna({
          target,
          ...rest
        })
      } else {
        return await this.doBuild({
          target,
          ...rest
        })
      }
    }
    return {}
  }

  private async doBuild(ops: IDoBuildOps) {
    const { target } = ops
    logger.debug(`get rollup config: `)
    const config = await this.getConfig(target)
    logger.debug(config)
    logger.debug(`do build in cwd `)
    logger.debug(this.api.cwd)
    // 1. get config
    if (config) {
      // 2. validate config
      this.validConfig(config)
      logger.info(chalk.yellow(`build ${target} bundler start \n`))
      // real build
      const { input, ...restConfig } = config
      if (Array.isArray(input)) {
        for (const i of input) {
          await this.rollup({
            input: i,
            ...restConfig
          })
        }
      } else {
        await this.rollup(config)
      }
    } else {
      logger.wran(`build target ${target} has no config to rollup`)
    }
    return {}
  }

  private async doBuildForLerna(ops: IDoBuildOps) {
    // lerna pkg
    logger.debug(`do lerna pkgs build `)
    const pkgRE = ops?.pointPkg ? new RegExp(ops.pointPkg) : false
    const pkgs = this.api
      .getLernaPkgs()
      .filter((pkg) => (pkgRE ? pkgRE.test(relative(this.api.cwd, pkg)) : true))
    logger.debug(pkgs)

    const saveCwd = this.api.cwd
    for (const pkg of pkgs) {
      process.chdir(pkg)
      await this.doBuild(ops)
    }
    process.chdir(saveCwd)

    logger.debug(`lerna pkgs build done back cwd`)
    logger.debug(this.api.cwd)
    return {}
  }

  private async rollup(config: IRollupConfig) {
    const { input, output, ...buildConfig } = config
    logger.info(`Rollup ${input}...`)
    const bundler = await rollup({
      input,
      ...buildConfig
    })
    if (output) {
      logger.info(`write ${output.file}...`)
      await bundler.write(output)
    }
  }
}

export type IRollupBundler = InstanceType<typeof RollupBundler>

export default RollupBundler
