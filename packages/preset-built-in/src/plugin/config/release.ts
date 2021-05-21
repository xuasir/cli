import type { IRunCmdMessage } from '@xus/cli-shared'
import { createSchema } from '@xus/cli-shared'

type ICmd = {
  bin: string
  args: string[]
  message: IRunCmdMessage
}

export type IReleaseConfig = {
  // before hooks for run lint test build...
  beforeRelease: ICmd[]
  changelog: boolean
  registry: string
  // in lenra mode to ensure pkg publish order
  order: string[]
  branch: string
}

export const releaseSchema = createSchema<IReleaseConfig>((joi) => {
  return joi.object({
    beforeRelease: joi.array().items(
      joi.object({
        bin: joi.string(),
        args: joi.array().items(joi.string()),
        message: joi.object({
          start: joi.string(),
          succeed: joi.string(),
          failed: joi.string()
        })
      })
    ),
    order: joi.array().items(joi.string()),
    branch: joi.string()
  })
})

export function defaultReleaseConfig(): IReleaseConfig {
  return {
    beforeRelease: [],
    changelog: false,
    registry: 'https://registry.npmjs.org/',
    order: [],
    branch: 'master'
  }
}
