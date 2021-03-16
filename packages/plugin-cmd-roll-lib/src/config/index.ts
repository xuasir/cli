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
    css: joi.object({
      injectScript: joi.boolean(),
      cssCodeSplit: joi.boolean(),
      modules: joi.object(),
      preprocessor: joi.object(),
      postcss: joi.object()
    }),

    // lerna mode
    pkgsOrder: joi.array().items(joi.string()),
    pointPkgs: joi.array().items(joi.string()),

    rollupChain: joi.function()
  })
)

export const defaultLibBuildConfig: () => IRollLibConfig = () => {
  return {
    libName: 'index',
    target: 'esnext',
    formats: [],
    rollTypes: true,
    sourcemap: false,
    minify: false,
    alwaysEmptyDistDir: false,
    css: {
      injectScript: false,
      cssCodeSplit: false,
      modules: {},
      preprocessor: {},
      postcss: {}
    },

    // lerna mode
    pkgsOrder: []
  }
}
