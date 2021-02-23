import type { IPluginAPI } from '@xus/cli'
import type { IBundlerImp } from '@xus/plugin-build-lib'
import type { IRollupChain } from './rollupChian'
import { rollup } from 'rollup'
import { terser } from 'rollup-plugin-terser'
import { chalk, Logger } from '@xus/cli'
import RollupChain from './rollupChian'
import rollupValidator from './validator'

const logger = new Logger(`xus:bundler:rollup`)

class RollupBundler implements IBundlerImp {
  private api

  constructor(api: IPluginAPI) {
    this.api = api
  }

  private getConfig() {
    // return rollupConfig
  }

  async build() {
    // if (!config) {
    //   warn(
    //     chalk.yellow(
    //       `build target ${target} has no rollup config, will be skip!!!`
    //     )
    //   )
    //   continue
    // }
    // build
    // const { output, ...bundleOps } = config
    // console.info(chalk.blueBright(`\n${bundleOps.input} -> ${output.file}`))
    // logWithSpinner(`run ${target} build...`)
    // try {
    //   const bundle = await rollup(bundleOps)
    //   await bundle.write(output)
    //   succeedSpinner(`${target} build succeed`)
    // } catch (error) {
    //   failSpinner(`${target} build faild ${error}`)
    // }
    return {}
  }

  private async doBuild() {
    // real build
  }

  private async buildForLerna() {
    // lerna pkg
  }
}

export type IRollupBundler = InstanceType<typeof RollupBundler>

export default RollupBundler
