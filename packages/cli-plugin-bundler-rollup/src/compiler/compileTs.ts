import { IPluginAPI } from '@xus/cli'
import type { IRollupManager } from '../rollupManager'

export async function compileTs(
  rollupManager: IRollupManager,
  api: IPluginAPI
): Promise<void> {
  console.log(`compile ts `, rollupManager)
}
