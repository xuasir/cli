import { createSchema } from '@xus/cli-shared'
import { IRollLibConfig } from '../types'

export const libBuildSchema = createSchema<IRollLibConfig>((joi) =>
  joi.object({
    libName: joi.string(),
    minify: [joi.string(), joi.boolean()],
    target: [joi.string(), joi.array().items(joi.string())],
    formats: joi.array().items(joi.string()),
    disableFormatPostfix: joi.boolean(),
    rollTypes: joi.boolean(),
    sourcemap: joi.boolean(),
    alwaysEmptyDistDir: joi.boolean(),
    css: joi.object({
      injectMode: joi.boolean(),
      cssCodeSplit: joi.boolean(),
      modules: joi.object(),
      preprocessor: joi.object(),
      postcss: joi.object()
    }),
    assets: {
      dirname: joi.string(),
      inlineLimit: joi.number()
    },
    json: {
      exportMode: joi.string()
    },
    alias: joi.object(),
    replace: joi.object(),
    excludeExternal: joi.array().items(joi.string()),
    external: joi.array().items(joi.string()),

    // lerna mode
    lerna: [
      joi.boolean(),
      joi.object({
        independentConfig: joi.boolean(),
        pkgsOrder: joi.array().items(joi.string()),
        excludePkgs: joi.array().items(joi.string())
      })
    ],

    rollupChain: joi.function(),
    afterBuild: joi.array()
  })
)

export const defaultLibBuildConfig: () => IRollLibConfig = () => {
  return {
    libName: 'index',
    target: 'esnext',
    formats: [],
    disableFormatPostfix: false,
    rollTypes: true,
    sourcemap: false,
    minify: false,
    alwaysEmptyDistDir: false,
    css: {
      injectMode: false,
      cssCodeSplit: false,
      modules: {},
      preprocessor: {},
      postcss: {}
    },
    assets: {
      dirname: 'assets',
      inlineLimit: 0
    },
    json: {
      exportMode: 'named'
    },
    alias: {},
    replace: {},
    excludeExternal: [],
    external: [],

    // lerna mode
    lerna: {
      independentConfig: false,
      pkgsOrder: [],
      excludePkgs: []
    },

    afterBuild: []
  }
}
