import type { IPluginAPI } from '@xus/cli'
import type { IRollupManager } from './rollupManager'
import { compileJs, compileTs, compileReact, compileVue } from './compiler'

export async function build(
  cmd: string,
  rollupManager: IRollupManager,
  api: IPluginAPI
): Promise<void> {
  switch (cmd) {
    case 'js':
      await compileJs(rollupManager, api)
      break
    case 'ts':
      await compileTs(rollupManager, api)
      break
    case 'react':
      await compileReact(rollupManager, api)
      break
    case 'vue':
      await compileVue(rollupManager, api)
      break
  }
}
