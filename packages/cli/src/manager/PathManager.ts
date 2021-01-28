import { join } from 'path'

class PathManager {
  ctxPath: string
  constructor(ctx: string) {
    this.ctxPath = ctx
  }

  get cwd(): string {
    return process.cwd()
  }

  get cliRootPath(): string {
    return join(__dirname, '../../')
  }

  get cliPkgJsonPath(): string {
    return join(__dirname, '../../package.json')
  }

  get rootPkgJsonPath(): string {
    return join(this.ctxPath, 'package.json')
  }

  get userConfigPath(): string {
    return join(this.ctxPath, 'xus.config.js')
  }

  getPathBasedOnCliRoot(basedOnRoot: string): string {
    return join(this.cliRootPath, basedOnRoot)
  }

  // for plugins
  getPath(basedOnRoot: string): string {
    return join(this.ctxPath, basedOnRoot)
  }
}

export type IPathManager = InstanceType<typeof PathManager>

export default PathManager
