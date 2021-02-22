import { join } from 'path'
import { getFileMeta } from '@xus/cli-shared'

export class PathManager {
  private ctxPath: string
  constructor(ctx: string) {
    this.ctxPath = ctx
  }

  get cwd(): string {
    return this.ctxPath || process.cwd()
  }

  get cwdPkg() {
    return this.getPathBasedOnCtx('package.json')
  }

  get userConfigPath() {
    const fileMeta = getFileMeta({
      base: this.ctxPath,
      filenameWithoutExt: 'xus.config'
    })
    return fileMeta && fileMeta.path
  }

  // for plugins
  getPathBasedOnCtx(basedOnRoot: string): string {
    return join(this.ctxPath, basedOnRoot)
  }
}

export type IPathManager = InstanceType<typeof PathManager>
