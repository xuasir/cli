import execa from 'execa'
import {
  mkdirSync,
  readdirSync,
  statSync,
  copyFileSync,
  existsSync,
  lstatSync,
  rmdirSync,
  unlinkSync
} from 'fs'
import { resolve } from 'path'
import { error } from './logger'
import { Spinner } from './spinner'

const spinner = new Spinner()

export function copy(src: string, dest: string) {
  const stat = statSync(src)
  if (stat.isDirectory()) {
    mkdirSync(dest, { recursive: true })
    for (const file of readdirSync(src)) {
      const srcPath = resolve(src, file)
      const destPath = resolve(dest, file)
      copy(srcPath, destPath)
    }
  } else {
    copyFileSync(src, dest)
  }
}

export function emptyDir(dir: string) {
  if (!existsSync(dir)) {
    return
  }
  for (const file of readdirSync(dir)) {
    const abs = resolve(dir, file)
    if (lstatSync(abs).isDirectory()) {
      emptyDir(abs)
      rmdirSync(abs)
    } else {
      unlinkSync(abs)
    }
  }
}

export const getPkgManager = () =>
  /yarn/.test(process.env?.npm_execpath || '') ? 'yarn' : 'npm'

export type IRunCmdMessage = {
  start: string
  succeed: string
  failed: string
}

export function runCmd(
  cmd: string,
  args: string[],
  message: IRunCmdMessage,
  options?: execa.Options
): Promise<boolean> {
  spinner.start(message.start)
  return new Promise((resolve, reject) => {
    execa(cmd, args, options)
      .then(() => {
        spinner.succeed(message.succeed)
        resolve(true)
      })
      .catch((err: any) => {
        spinner.failed(message.failed)
        error(err)
        reject(false)
      })
  })
}
