import { existsSync, readdirSync, lstatSync, rmdirSync, unlinkSync } from 'fs'
import { resolve } from 'path'

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
