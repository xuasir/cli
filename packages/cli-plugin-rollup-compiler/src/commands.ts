import type { IPluginAPI } from '@xus/cli'
import { compileJs } from './compiler'

export type Cmds = 'js' | 'react'
export const commands = ['js', 'react']

export async function build(cmd: Cmds, api: IPluginAPI): Promise<void> {
  switch (cmd) {
    case 'js':
      await compileJs(api)
      break
    case 'react':
      await compileJs(api, true)
      break
  }
}
