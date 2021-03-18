import webpackChain from 'webpack-chain'
// empty
import { IPlugin, IPreset, IConfig } from './types'

type IReturnArg<T extends any> = (args: T) => T

type PartialDeep<T extends Record<string, any>> = {
  [K in keyof T]?: T[K] extends Record<string, unknown> | boolean
    ? PartialDeep<T[K]>
    : T[K]
}

export const defineConfig: IReturnArg<PartialDeep<IConfig>> = (config) => config

export const createPlugin: IReturnArg<IPlugin> = (plugin) => plugin

export const createPreset: IReturnArg<IPreset> = (preset) => preset

// types
export * from './types'

export type { IArgs, IRawArgs, ICommand } from '@xus/core'

export type { IRollupChain, IRollupChainConfig } from '@xus/rollup-chain'

export type IWebpackChain = webpackChain
