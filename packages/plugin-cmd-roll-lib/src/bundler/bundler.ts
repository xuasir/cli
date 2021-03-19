import type { IRollupBuildOps, IRollupBuildFn } from './types'
import { Logger, chalk, emptyDir, prompt } from '@xus/cli-shared'
import fs from 'fs'
import path from 'path'
import { rollup, watch } from 'rollup'
import rollupValidator from './validator'

const logger = new Logger(`xus:bundler:rollup`)

export const rollupBundler: IRollupBuildFn = async (ops) => {
  logger.debug(`build ops `)
  logger.debug(ops)
  // logger.info(chalk.yellow(`${ops?.watch ? 'Watch' : 'Rollup'} start \n`))
  const { inputConfig } = ops
  // 1. validate config
  logger.debug(`validate input config: `)
  rollupValidator(inputConfig)
  // real build
  await doBuild(ops)
}

async function doBuild(ops: IRollupBuildOps) {
  const {
    pkgRoot,
    isWatch = false,
    isWrite = true,
    inputConfig,
    outputConfigs,
    alwaysEmptyDistDir,
    skipEmptyDistDir = false,
    disableConsoleInfo = false
  } = ops
  if (isWatch) {
    logger.debug(`do watch: `)
    const watcher = watch([
      {
        ...ops.inputConfig,
        ...ops.outputConfigs[0],
        watch: inputConfig?.watch ? inputConfig.watch : {}
      }
    ])
    watcher.on('event', (event: any) => {
      if (event.error) {
        logger.error(event.error)
      } else if (event.code === 'START') {
        logger.log(`Rebuild since file changed`)
      }
    })
    process.once('SIGINT', () => {
      watcher.close()
    })
  } else {
    logger.debug(`start rollup`)
    const bundler = await rollup({
      ...inputConfig,
      watch: false
    })

    await ensureDir(
      path.join(pkgRoot, outputConfigs[0].dir!),
      alwaysEmptyDistDir,
      skipEmptyDistDir
    )
    logger.debug(`start ${isWrite ? 'write' : 'generate'}`)
    for (const output of outputConfigs) {
      logger.debug(output)
      !disableConsoleInfo &&
        logger.info(
          chalk.green(`[${isWrite ? 'Write' : 'Generate'}] ${output.format}`)
        )
      await bundler[isWrite ? 'write' : 'generate'](output)
    }
    await bundler.close()
  }
}

async function ensureDir(
  dir: string,
  alwaysEmptyDistDir = false,
  skipEmptyDistDir = false
) {
  if (skipEmptyDistDir) return
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    const files = fs.readdirSync(dir)
    if (files.length > 0) {
      if (alwaysEmptyDistDir) {
        return emptyDir(dir)
      }
      const { yes } = await prompt<{ yes: boolean }>({
        type: 'confirm',
        name: 'yes',
        initial: 'Y',
        message:
          `dist directory ${dir} is not empty.\n` +
          `Remove existing files and continue?`
      })
      yes && emptyDir(dir)
    }
  }
}
