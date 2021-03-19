import type { IPluginAPI } from '@xus/cli-types'
import type { IRollupBuildOps } from '.'
import { runCmd, removeDirOrFile } from '@xus/cli-shared'
import { generateTypeOps } from '../resolveConfig'
import { rollupBundler } from '.'

export const TypesDir = 'xus_type'
export async function rollTypes(
  pkgRoot: string,
  buildOps: IRollupBuildOps,
  api: IPluginAPI
) {
  const res = await runCmd(
    'npx',
    ['tsc', '--emitDeclarationOnly', '--outDir', TypesDir],
    {
      start: 'generate types start',
      succeed: 'generate types succeed',
      failed: 'generate types failed'
    }
  )
  if (!res) return
  const ops = generateTypeOps(pkgRoot, buildOps)
  if (ops) {
    api.logger.debug(`[rollup types] with `, ops)
    await rollupBundler(ops)
    await removeDirOrFile([api.getPathBasedOnCtx(TypesDir)])
  }
}
