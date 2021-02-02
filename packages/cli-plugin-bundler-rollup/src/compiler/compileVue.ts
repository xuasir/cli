import { IPluginAPI } from '@xus/cli'
import type { IRollupManager } from '../rollupManager'

export async function compileVue(
  rollupManager: IRollupManager,
  api: IPluginAPI
): Promise<void> {
  console.log(`compile vue `, rollupManager)
}
