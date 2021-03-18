import { IRollupChain } from '@xus/cli-types'
import { IRunCmdMessage } from '@xus/cli-shared'
import { TransformOptions } from 'esbuild'
import { ICssModulesOps, IPostcssOps, IPreprocessorOps } from './plugins/css'

type ICmd = {
  bin: string
  args: string[]
  message: IRunCmdMessage
}

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
    injectMode: false | 'script' | 'url'
    cssCodeSplit: boolean
    modules: ICssModulesOps | false
    postcss: IPostcssOps
    preprocessor: IPreprocessorOps
  }
  assets: {
    dirname: string
    inlineLimit: number
  }
  json: {
    exportMode: 'named' | 'stringify'
  }
  alias: Record<string, string>
  replace: Record<string, string>
  excludeExternal: string[]

  // lerna mode
  lerna:
    | false
    | {
        // need to do ??
        independentConfig?: boolean
        pkgsOrder: string[]
        excludePkgs: string[]
      }

  // insider
  rollupChain?: (rc: IRollupChain) => IRollupChain
  afterBuild: ICmd[]
}

export interface IResolvedConfig extends Omit<IRollLibConfig, 'pkgsOrder'> {
  entry: string
  outDir: string
  // ready to roll pkg root
  pkgs: string[]
  independentMode: boolean
  // TODO：assets / css
  isWatch: boolean
}
