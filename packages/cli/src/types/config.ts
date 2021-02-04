import type { RollupPluginConfig } from '@xus/cli-plugin-bundler-rollup'
export interface ProjectConfig {
  contextPath?: string
  pluginOps?: {
    rollup?: RollupPluginConfig
    [key: string]: any
  }
}
