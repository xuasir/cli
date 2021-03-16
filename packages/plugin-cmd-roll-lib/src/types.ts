import { IRollupChain } from '@xus/cli-types'
import { TransformOptions } from 'esbuild'
import { ICssModulesOps, IPostcssOps, IPreprocessorOps } from './plugins/css'

export interface IRollLibConfig {
  libName: string
  target: 'esnext' | TransformOptions['target']
  formats: ('esm' | 'cjs' | 'iife' | 'umd')[]
  rollTypes: boolean
  sourcemap: boolean
  minify: false | 'esbuild' | 'terser'
  alwaysEmptyDistDir: boolean
  // css
  css: {
    injectScript: boolean
    cssCodeSplit: boolean
    modules: ICssModulesOps | false
    postcss: IPostcssOps
    preprocessor: IPreprocessorOps
  }

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
