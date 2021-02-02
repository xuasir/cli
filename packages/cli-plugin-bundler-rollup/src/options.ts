import type { RollupConfig } from './types'
import { createSchema, validate, ValidateCb } from '@xus/cli'

export const rollupSchema = createSchema<RollupConfig>((joi) =>
  joi.object({
    overrides: joi.array(),
    input: joi.alternatives(joi.string(), joi.object()),
    formats: joi.array().valid('esm', 'cjs', 'umd', 'browsers'),
    alias: joi.object(),
    replace: joi.object()
  })
)

export function rollupConfigValidator(obj: RollupConfig, cb: ValidateCb): void {
  return validate(obj, rollupSchema, cb)
}

export function defaultRollupConfig(): RollupConfig {
  return {
    formats: ['esm', 'cjs']
  }
}
