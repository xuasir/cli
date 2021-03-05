import { mkdirSync, readdirSync, statSync, copyFileSync } from 'fs'
import { resolve } from 'path'

export function copyDir(srcDir: string, destDir: string) {
  mkdirSync(destDir, { recursive: true })
  for (const file of readdirSync(srcDir)) {
    const srcFile = resolve(srcDir, file)
    const destFile = resolve(destDir, file)
    const stat = statSync(srcFile)
    if (stat.isDirectory()) {
      copyDir(srcFile, destFile)
    } else {
      copyFileSync(srcFile, destFile)
    }
  }
}
