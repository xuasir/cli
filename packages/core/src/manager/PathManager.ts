import { join, relative } from 'path'
import { statSync, readdirSync } from 'fs'
import { getFileMeta, isLernaPkg } from '@xus/cli-shared'

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

  getLernaPkgs({ root = this.ctxPath, isRelativeCwd = false } = {}): string[] {
    const pkgRoot = join(root, 'packages')
    if (isLernaPkg(root) && statSync(pkgRoot).isDirectory()) {
      return (readdirSync(pkgRoot) || []).reduce<string[]>(
        (memo, pkgDirName) => {
          const pkg = join(pkgRoot, pkgDirName)
          if (statSync(pkg).isDirectory()) {
            // support sub scope
            if (pkgDirName.startsWith('@')) {
              ;(readdirSync(pkg) || []).forEach((subPkgDirName) => {
                const subPkg = join(pkg, subPkgDirName)
                if (statSync(subPkg).isDirectory()) {
                  memo = [
                    ...memo,
                    isRelativeCwd ? relative(this.cwd, subPkg) : subPkg
                  ]
                }
              })
              return memo
            } else {
              return [...memo, isRelativeCwd ? relative(this.cwd, pkg) : pkg]
            }
          }
          return memo
        },
        []
      )
    }
    return []
  }
}

export type IPathManager = InstanceType<typeof PathManager>
