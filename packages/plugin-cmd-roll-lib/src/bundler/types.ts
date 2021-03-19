import type { RollupOptions, OutputOptions } from 'rollup'

export interface IRollupBuildOps {
  inputConfig: Omit<RollupOptions, 'output'>
  outputConfigs: OutputOptions[]
  isWatch: boolean
  isWrite: boolean
  pkgRoot: string
  alwaysEmptyDistDir: boolean
  skipEmptyDistDir?: boolean
  disableConsoleInfo?: boolean
}

export type IRollupBuildFn = (ops: IRollupBuildOps) => Promise<void>
