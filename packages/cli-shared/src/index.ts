import type { Debugger } from 'debug'
import type { IEsbuildRegister } from './EsbuildRegister'
// lib
export { default as chalk } from 'chalk'
export { default as createDebug } from 'debug'
export { default as yParser } from 'yargs-parser'
export { default as assert } from 'assert'
export { default as deepmerge } from 'deepmerge'
export { default as resolve } from 'resolve'
export { default as lodash } from 'lodash'
export { default as semver } from 'semver'
export { prompt } from 'enquirer'
export { default as fastGlob } from 'fast-glob'

// custom
export { Logger } from './logger'
export { Spinner } from './spinner'
export { createSchema, validateSchema } from './schema'
export { compatESModuleRequire } from './compatESModuleRequire'
export { winPath } from './winPath'
export { createEnvNameWithXusPrefix } from './env'
export * from './file'
export { loadModule } from './loadModule'
export * from './pkg'
export { EsbuildRegister } from './EsbuildRegister'
export * from './rimraf'
export * from './runCmd'
export * from './orderBy'
export * from './pkgManager'

// types export
export type IDebugger = Debugger
export type { IEsbuildRegister }

export type {
  IConfigSchema,
  IValidateCb,
  IConfigSchemaValidator
} from './schema'
