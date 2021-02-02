import type { ExternalOption, Plugin, OutputOptions } from 'rollup'
import type { addOptionsFn, CompileFormats } from '../types'

export const addExternals: addOptionsFn<ExternalOption> = (getExternals) => (
  config,
  mode
) => {
  const userExternal = getExternals(mode)
  const external = config?.external
  if (!external) {
    // no default  external
    config.external = userExternal
  } else if (!Array.isArray(external)) {
    // default external is string reg func
    config.external = userExternal
  } else {
    // default external is arrary
    if (typeof userExternal === 'function') {
      config.external = userExternal
    } else if (Array.isArray(userExternal)) {
      config.external = [...new Set([...external, ...userExternal])]
    } else {
      config.external = [...new Set([...external, userExternal])]
    }
  }

  return config
}

export const addPlugin: addOptionsFn<Plugin[]> = (getPlugins) => (
  config,
  mode
) => {
  const userPlugin = getPlugins(mode)
  const plugins = config?.plugins
  if (!plugins) {
    config.plugins = userPlugin
  } else {
    config.plugins = [...new Set([...plugins, ...userPlugin])]
  }
  return config
}
