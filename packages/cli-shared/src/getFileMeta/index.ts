import { join } from 'path'
import { existsSync } from 'fs'
import { winPath } from '../winPath'

interface IGetFileMetaOps {
  base: string
  filenameWithoutExt: string
}

const extsMap = {
  js: ['.ts', '.js']
}

export const getFileMeta = (ops: IGetFileMetaOps) => {
  const exts = extsMap.js
  for (const ext of exts) {
    const filename = `${ops.filenameWithoutExt}${ext}`
    const path = winPath(join(ops.base, filename))
    if (existsSync(path)) {
      return {
        path,
        filename
      }
    }
  }
  return null
}
