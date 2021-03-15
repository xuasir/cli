import { IRollupChain } from '@xus/cli-types'
import { TransformOptions } from 'esbuild'

export interface IRollLibConfig {
  libName: string
  // transform: 'esbuild' | 'babel'
  minify: false | 'esbuild' | 'terser'
  target: 'esnext' | TransformOptions['target']
  formats: ('esm' | 'cjs' | 'iife' | 'umd')[]
  rollTypes: boolean
  sourcemap: boolean
  alwaysEmptyDistDir: boolean

  // lerna mode
  pkgsOrder: string[]

  // insider
  rollupChain?: (rc: IRollupChain) => IRollupChain
}

export interface IResolvedConfig extends Omit<IRollLibConfig, 'pkgsOrder'> {
  entry: string
  outDir: string
  // ready to roll pkg root
  pkgs: string[]
  // TODO：assets / css
  isWatch: boolean
  // disabled esbuild handle
}
