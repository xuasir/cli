import path from 'path'
import { transformSync, Loader } from 'esbuild'
import { addHook } from 'pirates'

const files = new Set<string>()

function compile(code: string, filename: string) {
  const match = new RegExp(`(${[...files].join('|')})`)
  if (!match.test(filename)) {
    return code
  }
  const { code: js, warnings } = transformSync(code, {
    sourcefile: filename,
    sourcemap: false,
    target: 'node12.0.0',
    format: 'cjs',
    loader: path.extname(filename).slice(1) as Loader
  })
  if (warnings && warnings.length > 0) {
    for (const warning of warnings) {
      console.log(warning.location)
      console.log(warning.text)
    }
  }
  return js
}

let revert: any

export function register(file: string[]) {
  file.forEach((f) => files.add(f))
  if (!revert) {
    revert = addHook(compile, {
      exts: ['.js', '.jsx', '.ts', '.tsx'],
      ignoreNodeModules: false
    })
  }
}
