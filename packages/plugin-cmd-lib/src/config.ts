import type { IConfigSchemaValidator } from '@xus/cli'
import type { ILibBuildConfig } from './types'
import { createSchema, validateSchema } from '@xus/cli'

export const libBuildSchema = createSchema<ILibBuildConfig>((joi) =>
  joi.object({
    targets: joi.array(),
    pkg: joi.string(),
    rollupChain: joi.function()
  })
)

export const defaultLibBuildConfig: () => ILibBuildConfig = () => {
  return {
    targets: ['esm', 'cjs', 'browser', 'modern'],
    pkg: '',
    rollupChain: (rc) => rc
  }
}
