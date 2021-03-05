import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { dirname } from 'path'

export function writeFile(filename: string, content: string | Uint8Array) {
  const dir = dirname(filename)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  writeFileSync(filename, content)
}
