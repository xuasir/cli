import type { ProjectConfig, Args } from '@xus/cli'
import type { OverridesFn } from './rollup'

export type RollupConfig = {
  // override fn
  overrides?: OverridesFn[]
  // bundle input
  input?: string
  // output format esm cjs umd browsers
  formats?: string[]
  alias?: Record<string, string>
  // global variable replace
  replace?: Record<string, any>
  // global variable
  globals?: Record<string, string>
  // targets
}

export interface FinalConfig extends ProjectConfig {
  pluginOps: {
    rollup: RollupConfig
  }
}

export type FinalArgs = {
  formats?: string
  input?: string
} & Args
