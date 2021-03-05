import remove from 'rimraf'

export function rimraf(
  path: string,
  options: remove.Options = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    remove(path, options, (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}
