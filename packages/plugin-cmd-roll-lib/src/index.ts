import { createPlugin } from '@xus/cli-types'
import { chalk } from '@xus/cli-shared'
import { basename } from 'path'
import { rollupBundler } from './bundler'
import { resolveConfig, generateBuildOps } from './resolveConfig'
import { modifyConfig } from './modify'
// config
import { libBuildSchema, defaultLibBuildConfig } from './config'

export default createPlugin({
  name: 'cmd:lib:build',
  apply(api) {
    api.registerCommand(
      'lib-build',
      {
        desc: 'bunlde js ts react for lib mode, based on rollup/esbuild',
        usage: 'xus roll-lib',
        options: {
          '--entry': 'point entry file',
          '--outDir': 'point out file dir',
          '--pkgs': 'point pkg dir name',
          '--watch': 'watch mode',
          '--rollTypes': 'to rollup types files',
          '--sourcemap': 'to generate sourcemap'
        }
      },
      async (args) => {
        api.logger.debug(`raw args `)
        api.logger.debug(args)

        const config = api.projectConfig.libBuild
        // handle of args and config
        // resolveConfig
        api.logger.debug(`resolve config `)
        const resolvedConfig = resolveConfig(args, config, api)
        // default config should run before user modify
        api.logger.debug(`modify rollup config `)
        api.modifyRollupConfig({
          fn(rc) {
            modifyConfig(rc, resolvedConfig, api)
            if (resolvedConfig?.rollupChain) {
              resolvedConfig.rollupChain(rc)
            }
            return rc
          },
          stage: -100
        })

        api.logger.debug(`run lib build `)
        for (const pkg of resolvedConfig.pkgs) {
          const saveCwd = api.cwd
          process.chdir(pkg)
          // get all pkgs need to build
          api.logger.debug(`generate buildOps `)
          const buildOps = await generateBuildOps(pkg, resolvedConfig, api)
          // to rollup
          api.logger.info(chalk.yellow(`running for ${basename(pkg)}`))
          await rollupBundler(buildOps)
          process.chdir(saveCwd)
        }
      }
    )
  },
  config: {
    key: 'libBuild',
    schema: libBuildSchema,
    default: defaultLibBuildConfig
  }
})
