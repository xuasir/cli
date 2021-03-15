import { join } from 'path'
import { existsSync } from 'fs'
import { winPath } from '../winPath'

interface IGetFileMetaOps {
  base: string
  filenameWithoutExt: string
  type: 'js' | 'lib' | 'css'
}

const extsMap = {
  js: ['.ts', '.js'],
  lib: ['.js', 'jsx', '.ts', '.tsx'],
  css: ['.css', '.scss', '.sass', '.less']
}

export const getFileMeta = (
  ops: IGetFileMetaOps = {
    base: process.cwd(),
    filenameWithoutExt: '',
    type: 'js'
  }
) => {
  const exts = extsMap[ops.type]
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
