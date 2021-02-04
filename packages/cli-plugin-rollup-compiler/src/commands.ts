import type { IPluginAPI } from '@xus/cli'
import { compileJs, compileTs, compileReact, compileVue } from './compiler'

export async function build(cmd: string, api: IPluginAPI): Promise<void> {
  switch (cmd) {
    case 'js':
      await compileJs(api)
      break
    case 'ts':
      await compileTs(api)
      break
    case 'react':
      await compileReact(api)
      break
    case 'vue':
      await compileVue(api)
      break
  }
}
