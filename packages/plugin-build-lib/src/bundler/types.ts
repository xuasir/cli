import type { ILibBuildTargets, ILibBuildOps } from '../plugin/types'

export type IDoBuildOps = {
  target: ILibBuildTargets
} & Omit<ILibBuildOps, 'targets'>
