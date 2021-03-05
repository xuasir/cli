import type { IRunCmdMessage } from '@xus/cli'
import { createSchema } from '@xus/cli'

type ICmd = {
  bin: string
  args: string[]
  message: IRunCmdMessage
}

export type IReleaseConfig = {
  // before hooks for run lint test build...
  beforeRelease: ICmd[]
  // in lenra mode to ensure pkg publish order
  order: string[]
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
    order: joi.array().items(joi.string())
  })
})

export function defaultReleaseConfig(): IReleaseConfig {
  return {
    beforeRelease: [],
    order: []
  }
}
