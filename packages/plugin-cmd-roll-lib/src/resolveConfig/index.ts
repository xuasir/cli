import { IArgs, IPluginAPI } from '@xus/cli-types'
import { IRollupBuildOps } from '../bundler'
import { IRollLibConfig, IResolvedConfig } from '../types'
import { isLernaPkg, orderBy, getFileMeta } from '@xus/cli-shared'
import { relative, join, isAbsolute } from 'path'

export function resolveConfig(
  args: IArgs,
  config: IRollLibConfig,
  api: IPluginAPI
) {
  // ensure entry
  let entry = args?.entry
  if (!entry) {
    const fileMeta =
      getFileMeta({
        base: api.cwd,
        filenameWithoutExt: 'index',
        type: 'lib'
      }) ||
      getFileMeta({
        base: api.getPathBasedOnCtx('src'),
        filenameWithoutExt: 'index',
        type: 'lib'
      })
    entry = fileMeta?.path
    if (!entry) {
      throw new Error(`[resolve config] roll-lib should have a entry`)
    }
  }
  api.logger.debug(`[resolve config] entry: `)
  api.logger.debug(entry)

  // ensure output
  const outDir = args?.outDir || 'dist'
  api.logger.debug(`[resolve config] output: `)
  api.logger.debug(outDir)

  // order pkg
  let pkgs: string[] = args?.pkgs ? args.pkgs.split(',') : null
  if (isLernaPkg(api.cwd)) {
    const lernaRoot = api.getPathBasedOnCtx('packages')
    const pkgsOrder = config.pkgsOrder
    if (!pkgs) {
      pkgs = api.getLernaPkgs().map((p) => relative(lernaRoot, p))
    }
    pkgs = orderBy(pkgs, pkgsOrder).map((p) => join(lernaRoot, p))
  } else {
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
    isWatch: !!args?.watch
  }

  // do some ensure work
  // TODO: support bundled runtime target or do a legacy plugin ??
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

export async function generateBuildOps(
  pkgRoot: string,
  resolvedConfig: IResolvedConfig,
  api: IPluginAPI
): Promise<IRollupBuildOps> {
  const rollupConfig = await api.getRollupConfig()
  const isProd = api.mode === 'production'
  const { libName, outDir, formats, alwaysEmptyDistDir } = resolvedConfig
  if (rollupConfig) {
    api.logger.debug(`[generate buildOps] in ${pkgRoot}`)
    const { output, ...inputOps } = rollupConfig

    // input to absolute
    const entry = (inputOps.input = inputOps.input || resolvedConfig.entry)
    const isSingleEntry = typeof entry === 'string'
    if (typeof entry === 'string') {
      !isAbsolute(entry) && (inputOps.input = join(pkgRoot, entry))
    } else {
      Object.keys(entry).forEach((key) => {
        !isAbsolute(entry[key]) && (entry[key] = join(pkgRoot, entry[key]))
      })
    }
    api.logger.debug(`[generate buildOps] final inputConfig: `)
    api.logger.debug(inputOps)

    // output generate
    const outputOps = formats.map((format) => {
      const outputConfig = {
        name: libName,
        dir: outDir,
        format,
        exports: format === 'cjs' ? 'named' : 'auto',
        namespaceToStringTag: true,
        entryFileNames: isProd
          ? `${isSingleEntry ? libName : '[name]'}.${format}.prod.js`
          : `${isSingleEntry ? libName : '[name]'}.${format}.js`,
        chunkFileNames: `[name].js`,
        sourcemap: !!resolvedConfig?.sourcemap,
        ...output
      }
      delete outputConfig.file

      return outputConfig
    })
    api.logger.debug(`[generate buildOps] final outputConfig: `)
    api.logger.debug(outputOps)

    return {
      inputConfig: inputOps,
      outputConfigs: outputOps,
      isWatch: resolvedConfig.isWatch,
      isWrite: true,
      pkgRoot,
      alwaysEmptyDistDir
    } as IRollupBuildOps
  } else {
    throw new Error(`roll-lib need a rollup config`)
  }
}
