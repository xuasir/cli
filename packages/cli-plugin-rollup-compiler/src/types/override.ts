import type { Args } from '@xus/cli'

export type FinalArgs = {
  targets?: string
  sourcemap?: string
  prod?: boolean
} & Args
