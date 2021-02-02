import type { RollupOptions } from 'rollup'

export type CompileMode = {
  isESM: boolean
  isCJS: boolean
  isUMD: boolean
  isBrowsers: boolean
}

export type SetOptionsFn<T = any> = (mode: CompileMode) => T

export type OverridesFn = (
  config: RollupOptions,
  mode: CompileMode
) => RollupOptions

export type addOptionsFn<T = any> = (setOption: SetOptionsFn<T>) => OverridesFn

export type Modes = 'esm' | 'cjs' | 'umd' | 'browsers'

export type CompileFormats = 'esm' | 'cjs' | 'umd' | 'iife'
