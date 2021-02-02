import { IPluginAPI } from '@xus/cli'
import type { IRollupManager } from '../rollupManager'

export async function compileReact(
  rollupManager: IRollupManager,
  api: IPluginAPI
): Promise<void> {
  console.log(`compile React `, rollupManager)
}
