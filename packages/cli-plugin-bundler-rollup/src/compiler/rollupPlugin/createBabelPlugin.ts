import type { Plugin } from 'rollup'
import type { CompileMode } from '../../types'
import {
  getBabelOutputPlugin,
  RollupBabelOutputPluginOptions
} from '@rollup/plugin-babel'
import vue from 'rollup-plugin-vue'

export const createBabelPlugin = (
  babelConfig: RollupBabelOutputPluginOptions,
  { isBrowsers, isCJS, isESM, isUMD }: CompileMode,
  isReact: boolean,
  isVue: boolean
) => {
  if (babelConfig) return [getBabelOutputPlugin(babelConfig)]
  const preset =
    (isReact && '@xus/babel-preset/lib/react') ||
    (isVue && '@xus/babel-preset/lib/vue') ||
    '@xus/babel-preset'
  return [
    isVue &&
      vue({
        target: isCJS ? 'node' : 'browser',
        exposeFilename: false
      }),
    (isBrowsers || isUMD) &&
      getBabelOutputPlugin({
        presets: [
          [
            preset,
            {
              useTransformRuntime: false,
              useDynamicImport: true,
              vueJSX: isVue
            }
          ]
        ]
      }),
    isESM &&
      getBabelOutputPlugin({
        presets: [
          [
            preset,
            {
              useESModules: true,
              absoluteRuntime: false,
              vueJSX: isVue
            }
          ]
        ]
      }),
    isCJS &&
      getBabelOutputPlugin({
        presets: [
          [
            preset,
            {
              targets: { node: 'current' },
              absoluteRuntime: false,
              useDynamicImport: true,
              vueJSX: isVue
            }
          ]
        ]
      })
  ].filter(Boolean) as Plugin[]
}
