import type { ILibBuildConfig } from './types'
import { createSchema } from '@xus/cli'

export const libBuildSchema = createSchema<ILibBuildConfig>((joi) =>
  joi.object({
    targets: joi.array(),
    pointPkgs: joi.array(),
    pkgOrder: joi.array(),
    rollupChain: joi.function(),
    rollTypes: joi.boolean()
  })
)

export const defaultLibBuildConfig: () => ILibBuildConfig = () => {
  return {
    targets: [],
    rollTypes: false
  }
}
