import { createDebug, lodash, winPath } from '..'
import { register } from 'esbuild-register/dist/node'
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
    only.forEach((file) => {
      register({
        sourcefile: file,
        sourcemap: false,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        format: 'cjs',
        target: 'es2019'
      })
    })
  }
}

export type IEsbuildRegister = InstanceType<typeof EsbuildRegister>
