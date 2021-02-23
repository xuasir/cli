// lib
export { default as chalk } from 'chalk'
export { default as createDebug, Debugger as IDebugger } from 'debug'
export { default as yParser } from 'yargs-parser'
export { default as assert } from 'assert'
export { default as deepmerge } from 'deepmerge'
export { default as resolve } from 'resolve'
export { default as lodash } from 'lodash'

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
export { BabelRegister } from './BabelRegister'

// types export
export type {
  IConfigSchema,
  IValidateCb,
  IConfigSchemaValidator
} from './schema'
