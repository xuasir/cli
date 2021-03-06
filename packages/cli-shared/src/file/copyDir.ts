import { mkdirSync, readdirSync, statSync, copyFileSync } from 'fs'
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
