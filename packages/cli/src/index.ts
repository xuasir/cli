export * from '@xus/cli-shared'
export { CliService, HookTypes } from '@xus/core'
// compose plugin with core
export * from './exports'
// plugins
export * from '@xus/preset-built-in'

// types
export type {
  IArgs,
  IRawArgs,
  ICommand,
  IHook,
  IFastHookRegister
} from '@xus/core'
