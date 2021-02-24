import type { IProjectConfig } from './types'
import type { IConfigSchemaValidator } from '@xus/cli-shared'
import { createSchema, validateSchema } from '@xus/cli-shared'

export const ProjectConfigSchema = createSchema<IProjectConfig>((joi) => {
  return joi.object({
    mode: joi.string(),
    plugins: joi.array(),
    presets: joi.array()
  })
})

export const projectConfigValidator: IConfigSchemaValidator<IProjectConfig> = (
  obj,
  cb
) => {
  return validateSchema(obj, ProjectConfigSchema, cb)
}

export function defaultProjectConfig(
  ops: Partial<IProjectConfig>
): IProjectConfig {
  return {
    ...ops,
    mode: ops?.mode || 'development'
  }
}
