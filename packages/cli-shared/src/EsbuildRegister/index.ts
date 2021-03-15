import { createDebug, lodash, winPath } from '..'
import { register } from './register'

const debug = createDebug('xus:shared:EsbuildRegister')
export class EsbuildRegister {
  private only: Record<string, string[]> = {}

  setOnlyMap({ key, value }: { key: string; value: string[] }) {
    debug(`set ${key} of only map:`)
    debug(value)
    this.only[key] = value
    this.register()
  }

  private register() {
    const only = lodash.uniq(
      Object.keys(this.only)
        .reduce<string[]>((memo, key) => {
          return memo.concat(this.only[key])
        }, [])
        .map(winPath)
    )

    register(only)
  }
}

export type IEsbuildRegister = InstanceType<typeof EsbuildRegister>
