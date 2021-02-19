import type { RollupPluginConfig } from '@xus/plugin-bundler-rollup'
export interface ProjectConfig {
  contextPath?: string
  pluginOps?: {
    rollup?: RollupPluginConfig
    [key: string]: any
  }
}
