import { mkdirSync, readdirSync, statSync, copyFileSync } from 'fs'
import { resolve } from 'path'

export function copy(src: string, dest: string) {
  mkdirSync(dest, { recursive: true })
  for (const file of readdirSync(src)) {
    const srcPath = resolve(src, file)
    const destPath = resolve(dest, file)
    const stat = statSync(srcPath)
    if (stat.isDirectory()) {
      copy(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}
