import type { IPluginAPI, IBundlerImp, ILibBuildTargets } from '@xus/cli'
import type { IRollupChain } from './rollupChian'
import type { IRollupConfig } from './rollupChian/lib/types'
import type { IDoBuildOps } from './types'
import { basename, join } from 'path'
import { rollup, watch } from 'rollup'
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
      watch: false
    }
  ) {
    logger.debug(`build ops `)
    logger.debug(ops)
    const { targets, ...rest } = ops
    for (const target of targets as ILibBuildTargets[]) {
      logger.info(
        chalk.yellow(
          `[${rest.watch ? 'Watch' : 'Rollup'}] ${target} bundler start \n`
        )
      )
      if (isLernaPkg(this.api.cwd)) {
        this.api.setCliEnv('Lerna_Root', this.api.cwd)
        await this.doBuildForLerna({
          target,
          ...rest
        })
      } else {
        await this.doBuild({
          target,
          ...rest
        })
      }
    }
    return {
      watch: ops.watch
    }
  }

  private async doBuild(ops: IDoBuildOps) {
    const { target, watch } = ops
    logger.debug(`get rollup config: `)
    const config = await this.getConfig(target)
    logger.debug(config)
    logger.debug(`do build in cwd `)
    logger.debug(this.api.cwd)
    // 1. get config
    if (config) {
      // 2. validate config
      this.validConfig(config)
      // real build
      const { input, ...restConfig } = config
      if (Array.isArray(input)) {
        for (const i of input) {
          await this.rollup(
            {
              input: i,
              ...restConfig
            },
            watch
          )
        }
      } else {
        await this.rollup(config, watch)
      }
    } else {
      logger.wran(`build target ${target} has no config to rollup`)
    }
    return {}
  }

  private async doBuildForLerna(ops: IDoBuildOps) {
    // lerna pkg
    logger.debug(`do lerna pkgs build `)
    const order = ops?.order
    const pointPkg = ops?.pointPkg
    const filterPkgs = this.api
      .getLernaPkgs()
      .filter((pkg) => (pointPkg ? pointPkg.includes(basename(pkg)) : true))
    // to order
    let pkgs: string[] = []
    if (!order) {
      pkgs = filterPkgs
    } else {
      const fp = filterPkgs.map((p) => basename(p))
      const dirname = join(this.api.cwd, 'packages')
      pkgs = order.filter((o) => fp.includes(o)).map((o) => join(dirname, o))
    }
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

  private async rollup(config: IRollupConfig, isWatch = false) {
    if (isWatch) {
      const watcher = watch([
        {
          ...config,
          watch: config?.watch ? config.watch : {}
        }
      ])
      watcher.on('event', (event: any) => {
        if (event.error) {
          this.api.logger.error(event.error)
        } else if (event.code === 'START') {
          this.api.logger.log(`Rebuild since file changed`)
        }
      })
      process.once('SIGINT', () => {
        watcher.close()
      })
    } else {
      const { input, output, ...buildConfig } = config
      logger.info(chalk.green(`[write] ${input} -> ${output.file}`))
      const bundler = await rollup({
        input,
        ...buildConfig,
        watch: false
      })
      await bundler.write(output)
      await bundler.close()
    }
  }
}

export type IRollupBundler = InstanceType<typeof RollupBundler>

export default RollupBundler
