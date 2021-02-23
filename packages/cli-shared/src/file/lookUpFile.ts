import { existsSync, statSync, readFileSync } from 'fs'
import { join, dirname } from 'path'

export function lookUpFile(
  dir: string,
  formats: string[],
  pathOnly = false
): string | undefined {
  for (const format of formats) {
    const fullPath = join(dir, format)
    if (existsSync(fullPath) && statSync(fullPath).isFile()) {
      return pathOnly ? fullPath : readFileSync(fullPath, 'utf-8')
    }
  }
  const parentDir = dirname(dir)
  if (parentDir !== dir) {
    return lookUpFile(parentDir, formats, pathOnly)
  }
}
