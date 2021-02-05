import type { RollupPluginConfig } from './types'
import { createSchema, validate, ValidateCb } from '@xus/cli'

export const rollupSchema = createSchema<RollupPluginConfig>((joi) =>
  joi.object({
    chainRollup: joi.func(),
    targets: joi.array().valid('esm-bundler', 'esm-browser', 'node', 'global')
  })
)

export function rollupConfigValidator(
  obj: RollupPluginConfig,
  cb: ValidateCb
): void {
  return validate(obj, rollupSchema, cb)
}

export function defaultRollupConfig(): RollupPluginConfig {
  return {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    chainRollup: () => {},
    targets: ['esm-bundler', 'esm-browser', 'node', 'global']
  }
}

export const createRollupPluginConfig = (config: Partial<RollupPluginConfig>) =>
  config
