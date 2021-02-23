import { existsSync } from 'fs'
import { join } from 'path'

export const isLernaPkg = (root: string) => {
  return existsSync(join(root, 'lerna.json'))
}
