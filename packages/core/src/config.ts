import type { IProjectConfig } from './types'
import { createSchema } from '@xus/cli-shared'

export const ProjectConfigSchema = createSchema<IProjectConfig>((joi) => {
  return joi.object().keys({
    mode: joi.string(),
    plugins: joi.array(),
    presets: joi.array()
  })
})

export function defaultProjectConfig(
  ops: Partial<IProjectConfig>
): IProjectConfig {
  return {
    ...ops,
    mode: ops?.mode || 'development'
  }
}
