import type { ILibBuildTargets } from '@xus/cli'
import { createPlugin } from '@xus/cli'
import {
  defaultInput,
  ensureOutput,
  ensureCorePlugin,
  ensureCommonPlugin,
  ensureOtherConfig
} from './modify'

const DefaultTargets = ['esm', 'cjs', 'browser', 'modern']

export default createPlugin({
  name: 'cmd:lib',
  apply(api) {
    api.registerCommand(
      'lib',
      {
        desc: 'bunlde js ts react for lib mode, based on rollup',
        usage: 'xus lib',
        options: {
          '--pkg': 'point pkg dir name',
          '--targets': 'point build target esm|cjs|browser|modern',
          '--watch': 'watch mode',
          '--rollTypes': 'to rollup types files'
        }
      },
      (args) => {
        api.logger.debug(`raw args `)
        api.logger.debug(args)

        const config = api.projectConfig.libBuild
        // handle of args
        let targets = (config?.targets || DefaultTargets) as ILibBuildTargets[]
        if (args?.targets) {
          targets = (args?.targets as string)
            .split(',')
            .filter((target) =>
              DefaultTargets.includes(target)
            ) as ILibBuildTargets[]
        }
        if (args?.rollTypes) {
          targets.push('rollTypes')
        }

        api.logger.debug(`build targets `)
        api.logger.debug(targets)

        api.logger.debug(`modify config `)
        // default config should run before user modify
        api.modifyRollupConfig({
          fn(rc, ctx) {
            defaultInput(rc, ctx, api)
            ensureCommonPlugin(rc, ctx, api)
            ensureCorePlugin(rc, ctx, api)
            // external and so on
            ensureOtherConfig(rc, ctx, api)
            return rc
          },
          stage: -100
        })

        api.modifyRollupConfig({
          fn(rc, ctx) {
            // user modify
            if (config?.rollupChain) {
              config.rollupChain(rc, ctx)
            }
            // ensure config should run after user modify
            ensureOutput(rc, ctx, api)
            return rc
          },
          // last to run
          stage: 100
        })

        // run
        api.logger.debug(`run lib build `)
        const pointPkgs = args?.pkg
          ? (args?.pkg as string).split(',')
          : undefined
        api.runLibBuild({
          targets: targets as ILibBuildTargets[],
          pointPkg: config?.pointPkgs || pointPkgs || undefined,
          watch: !!args?.watch,
          order: config?.pkgOrder
        })

        // on success
        api.onLibBuildSucceed((ops) => {
          if (!ops?.watch) {
            api.logger.success(`lib build succeed!!!`)
          }
        })
        // on failed
        api.onLibBuildFailed((e) => {
          api.logger.error(`lib build failed, ${e}`)
        })
      }
    )
  }
})
