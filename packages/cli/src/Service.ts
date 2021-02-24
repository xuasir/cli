import { CliService } from '@xus/core'
import presetBuiltIn from '@xus/preset-built-in'

type IXUSCliServiceOps = {
  mode: string
}

export class XUSCliService extends CliService {
  constructor(ops: IXUSCliServiceOps) {
    super({
      ...ops,
      presets: [presetBuiltIn],
      plugins: []
    })
  }
}
