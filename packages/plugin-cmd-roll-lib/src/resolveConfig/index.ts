import { IArgs, IPluginAPI } from '@xus/cli-types'
import { IRollupBuildOps } from '../bundler'
import { IRollLibConfig, IResolvedConfig } from '../types'
import { isLernaPkg, orderBy, getFileMeta, Logger } from '@xus/cli-shared'
import { relative, join, isAbsolute, extname, basename } from 'path'
import { TypesDir } from '../bundler'
import dts from 'rollup-plugin-dts'

export function resolveConfig(
  args: IArgs,
  config: IRollLibConfig,
  api: IPluginAPI
) {
  // ensure mode
  if (api.mode === 'production') {
    !config.minify && (config.minify = 'terser')
    config.sourcemap = true
  }
  // ensure entry
  const entry = args?.entry
  api.logger.debug(`[resolve config] entry: `)
  api.logger.debug(entry)

  // ensure output
  const outDir = args?.outDir || 'dist'
  api.logger.debug(`[resolve config] output: `)
  api.logger.debug(outDir)

  // ensure formats
  if (args?.formats && typeof args.formats === 'string') {
    const argFormats = args.formats
      .split(',')
      .filter((f) => ['cjs', 'esm', 'iife', 'umd'].includes(f))
    if (argFormats.length > 0) {
      config.formats = argFormats as ('cjs' | 'esm' | 'iife' | 'umd')[]
    }
  }

  // order pkg
  const lerna = config.lerna
  let pkgs: string[] = args?.pkgs ? args.pkgs.split(',') : null
  if (isLernaPkg(api.cwd)) {
    if (lerna === false) {
      // disabled lerna pack
      pkgs = [api.cwd]
    } else {
      // default lerna pack
      const lernaRoot = api.getPathBasedOnCtx('packages')
      const pkgsOrder = lerna.pkgsOrder
      const excludePkgs = lerna.excludePkgs
      if (!pkgs) {
        pkgs = api.getLernaPkgs().map((p) => relative(lernaRoot, p))
      }
      pkgs = orderBy(pkgs, pkgsOrder)
        .filter((pkg) => !excludePkgs.includes(pkg))
        .map((p) => join(lernaRoot, p))
    }
  } else {
    // simple pack
    pkgs = [api.cwd]
  }
  api.logger.debug(`[resolve config] pkgs: `)
  api.logger.debug(pkgs)

  const resolvedConfig: IResolvedConfig = {
    ...config,
    rollTypes: !!args?.rollTypes || config.rollTypes,
    sourcemap: !!args?.sourcemap || config.sourcemap,
    pkgs,
    entry,
    outDir,
    isWatch: !!args?.watch,
    independentMode: lerna && !!lerna.independentConfig
  }

  // ensure target
  // support bundled runtime target by legacy plugin
  if (
    resolvedConfig.target === 'esnext' ||
    resolvedConfig.target?.includes('esnext')
  ) {
    resolvedConfig.target = 'es2019'
  }

  if (resolvedConfig.formats.length < 1) {
    resolvedConfig.formats = ['esm', 'cjs']
  }
  api.logger.debug(`[resolve config] config`)
  api.logger.debug(resolvedConfig)
  return resolvedConfig
}

const buildLogger = new Logger(`xus:generate:build`)
export async function generateBuildOps(
  pkgRoot: string,
  resolvedConfig: IResolvedConfig,
  api: IPluginAPI
): Promise<IRollupBuildOps> {
  const rollupConfig = await api.getRollupConfig(basename(pkgRoot))
  const isProd = api.mode === 'production'
  const {
    libName,
    outDir,
    formats,
    alwaysEmptyDistDir,
    disableFormatPostfix
  } = resolvedConfig
  if (rollupConfig) {
    buildLogger.debug(`[generate buildOps] in ${pkgRoot}`)
    buildLogger.debug(`rollup config input `, rollupConfig.input)
    buildLogger.debug(`resolved config input `, resolvedConfig.entry)
    const { output, ...inputOps } = rollupConfig
    // TODO: support from rollup-chain
    inputOps.preserveEntrySignatures = 'strict'
    // input to absolute
    if (!inputOps.input && !resolvedConfig.entry) {
      const fileMeta = getFileMeta({
        base: api.getPathBasedOnCtx('src'),
        filenameWithoutExt: 'index',
        type: 'lib'
      })
      const entry = fileMeta?.path
      if (!entry) {
        throw new Error(`[generate buildOps] lib-build should have a entry`)
      } else {
        inputOps.input = entry
      }
      buildLogger.debug(`auto find entry `, entry)
    }
    const entry = (inputOps.input = inputOps.input || resolvedConfig.entry)
    const isSingleEntry = typeof entry === 'string'
    if (typeof entry === 'string') {
      !isAbsolute(entry) && (inputOps.input = join(pkgRoot, entry))
    } else {
      Object.keys(entry).forEach((key) => {
        !isAbsolute(entry[key]) && (entry[key] = join(pkgRoot, entry[key]))
      })
    }
    buildLogger.debug(`[generate buildOps] final inputConfig: `)
    buildLogger.debug(inputOps)
    // output generate
    const outputOps = formats.map((format) => {
      const outputConfig = {
        name: libName,
        dir: outDir,
        format,
        exports: format === 'cjs' ? 'named' : 'auto',
        namespaceToStringTag: true,
        entryFileNames: `${isSingleEntry ? libName : '[name]'}${
          disableFormatPostfix ? '' : '.' + format
        }${isProd ? '.prod' : ''}.js`,
        chunkFileNames: `[name].js`,
        sourcemap: !!resolvedConfig?.sourcemap,
        ...output
      }
      delete outputConfig.file

      return outputConfig
    })
    buildLogger.debug(`[generate buildOps] final outputConfig: `)
    buildLogger.debug(outputOps)

    return {
      inputConfig: inputOps,
      outputConfigs: outputOps,
      isWatch: resolvedConfig.isWatch,
      isWrite: true,
      pkgRoot,
      alwaysEmptyDistDir
    } as IRollupBuildOps
  } else {
    throw new Error(`lib-build need a rollup config`)
  }
}

const typeLogger = new Logger(`xus:generate:types`)
const tsRE = /\.tsx?$/
export function generateTypeOps(
  pkgRoot: string,
  buildOps: IRollupBuildOps
): IRollupBuildOps | null {
  typeLogger.debug(`rollup types in `, pkgRoot)
  typeLogger.debug(`with `, buildOps.inputConfig.input)
  typeLogger.debug(`cwd `, process.cwd())
  const entry = buildOps.inputConfig.input
  let inputs: Record<string, string> = {}
  if (entry) {
    if (typeof entry === 'string' && tsRE.test(entry)) {
      const ext = extname(entry)
      const bn = basename(entry)
      inputs[bn.slice(0, -ext.length)] = entry
    }
    if (!Array.isArray(entry) && typeof entry !== 'string') {
      inputs = {
        ...inputs,
        ...entry
      }
    }
    const tempRoot = join(pkgRoot, TypesDir)
    Object.keys(inputs).forEach((key) => {
      const i = inputs[key]
      let r = relative(pkgRoot, i)
      if (tsRE.test(r)) {
        if (r.startsWith('src')) {
          r = relative('src', r)
        }
        const ext = extname(r)
        inputs[key] = join(tempRoot, `${r.slice(0, -ext.length)}.d.ts`)
      } else {
        delete inputs[key]
      }
    })
    typeLogger.debug(`[generate types options] types entry: `)
    typeLogger.debug(inputs)
    return {
      inputConfig: {
        input: inputs,
        plugins: [dts()]
      },
      outputConfigs: [
        {
          dir: buildOps.outputConfigs?.[0]?.dir || 'dist',
          format: 'es',
          entryFileNames: `[name].d.ts`
        }
      ],
      isWatch: buildOps.isWatch,
      isWrite: true,
      pkgRoot,
      alwaysEmptyDistDir: false,
      skipEmptyDistDir: true,
      disableConsoleInfo: true
    }
  }
  return null
}
