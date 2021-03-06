import { prompt } from 'enquirer'
import chalk from 'chalk'
import { emptyDir, copy, getPkgManager } from './utils'
import { Spinner } from './spinner'
import { join, relative } from 'path'
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs'

const BuiltInTemp = ['ts-lib', 'ts-lib-lerna']
const FileMap: Record<string, string> = {
  _eslintignore: '.eslintignore',
  '_eslintrc.js': '.eslintrc.js',
  _gitignore: '.gitignore',
  '_prettierrc.js': '.prettierrc.js'
}
const spinner = new Spinner()

export async function createTemp(args: { _: string[]; [key: string]: any }) {
  const cwd = process.cwd()
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

  const root = join(cwd, projectDir)
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
  console.log(`Done. ready to run:\n`)
  if (cwd !== root) {
    console.log(chalk.green(`  cd ${relative(cwd, root)}`))
  }
  console.log(
    chalk.green(`  ${pkgManager === 'yarn' ? `yarn` : `npm install`}`)
  )
  console.log()
}
