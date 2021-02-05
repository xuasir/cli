import type { ProjectConfig } from './types'
import { createSchema, ValidateCb, validate } from './utils'

export const ProjectConfigSchema = createSchema<ProjectConfig>((joi) => {
  return joi.object({
    contextPath: joi.string(),
    pluginOps: joi.object()
  })
})

export function projectConfigValidator(
  obj: ProjectConfig,
  cb: ValidateCb
): void {
  return validate(obj, ProjectConfigSchema, cb)
}

export function defaultProjectConfig(contextPath: string): ProjectConfig {
  return {
    contextPath
  }
}

export const createXusConfig = (config: ProjectConfig) => config
