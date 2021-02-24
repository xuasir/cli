export * from '@xus/cli-shared'
export { CliService, HookTypes } from '@xus/core'
// compose plugin with core
export * from './exports'
// plugins
export * from '@xus/plugin-build-lib'
export * from '@xus/plugin-bundler-rollup'

// types
export type {
  IArgs,
  IRawArgs,
  ICommand,
  IHook,
  IFastHookRegister
} from '@xus/core'
