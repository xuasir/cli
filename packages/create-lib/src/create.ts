import type { IPluginAPI, IArgs } from '@xus/cli'
import {
  prompt,
  emptyDir,
  copy,
  getPkgManager,
  runCmd,
  Spinner
} from '@xus/cli'
import { join } from 'path'
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs'

const BuiltInTemp = ['ts-lib', 'ts-lib-lerna']
const FileMap: Record<string, string> = {
  _eslintignore: '.eslintignore',
  '_eslintrc.js': '.eslintrc.js',
  _gitignore: '.gitignore',
  '_prettierrc.js': '.prettierrc.js'
}
const spinner = new Spinner()

export async function createTemp(args: IArgs, api?: IPluginAPI) {
  api?.logger.debug(`handle of project dir`)
  let projectDir = args._.shift()
  if (!projectDir) {
    const { name } = await prompt<{ name: string }>({
      type: 'input',
      name: 'name',
      message: `Project name:`,
      initial: 'xus-project'
    })
    projectDir = name
  }
  api?.logger.debug(projectDir)

  const root = join(process.cwd(), projectDir)
  api?.logger.debug(`create root ${root}`)
  if (!existsSync(root)) {
    mkdirSync(root, { recursive: true })
  } else {
    const files = readdirSync(root)
    if (files.length > 0) {
      const { yes } = await prompt<{ yes: boolean }>({
        type: 'confirm',
        name: 'yes',
        initial: 'Y',
        message:
          `Target directory ${root} is not empty.\n` +
          `Remove existing files and continue?`
      })

      if (yes) {
        emptyDir(root)
      } else {
        return
      }
    }
  }

  api?.logger.debug(`ready to copy`)
  api?.logger.debug(`ensure template`)
  let temp = args?.t || args?.template
  let message = 'Select a template'
  let isvalidTemp = false

  if (temp) {
    isvalidTemp = BuiltInTemp.includes(temp)
    message = `${temp} isn't a valid template. Please choose:`
  }

  if (!temp || !isvalidTemp) {
    const { t } = await prompt<{ t: string }>({
      type: 'select',
      name: 't',
      message,
      choices: BuiltInTemp
    })
    temp = t
  }
  api?.logger.debug(temp)

  api?.logger.debug(`copy file`)
  spinner.start(`Create project start`)
  const tempDir = join(__dirname, `./template/${temp}`)
  function write(file: string, content?: string) {
    const to = join(root, FileMap[file] ? FileMap[file] : file)
    const form = join(tempDir, file)
    if (content) {
      writeFileSync(to, content)
    } else {
      copy(form, to)
    }
  }
  const files = readdirSync(tempDir)
  for (const file of files) {
    write(file)
  }
  spinner.succeed(`Create project succeed`)

  const pkgManager = getPkgManager()
  api?.logger.debug(`current pkgManager ${pkgManager}`)
  api?.logger.debug(`install deps`)
  await runCmd(pkgManager, pkgManager === 'yarn' ? [] : ['install'], {
    start: 'Install deps start',
    succeed: 'Install deps succeed',
    failed: 'Install deps failed'
  })
}
