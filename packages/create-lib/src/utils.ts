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
