import { createSchema } from '@xus/cli-shared'
import { IRollLibConfig } from '../types'

export const libBuildSchema = createSchema<IRollLibConfig>((joi) =>
  joi.object({
    libName: joi.string(),
    minify: [joi.string(), joi.boolean()],
    target: [joi.string(), joi.array().items(joi.string())],
    formats: joi.array().items(joi.string()),
    rollTypes: joi.boolean(),
    sourcemap: joi.boolean(),
    alwaysEmptyDistDir: joi.boolean(),

    // lerna mode
    pkgsOrder: joi.array().items(joi.string()),
    pointPkgs: joi.array().items(joi.string()),

    rollupChain: joi.function()
  })
)

export const defaultLibBuildConfig: () => IRollLibConfig = () => {
  return {
    libName: 'index',
    minify: 'terser',
    target: 'esnext',
    formats: [],
    rollTypes: true,
    sourcemap: false,
    alwaysEmptyDistDir: false,

    // lerna mode
    pkgsOrder: []
  }
}
