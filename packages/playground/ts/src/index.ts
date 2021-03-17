// es6+
export const trim = '   123'.trimStart()
export const arrFlat = [['1', '2'], 3].flat()

// dynamic import
export const di = async () => {
  await Promise.resolve(3)
  await import('./di')
}

// types
export const t = '1'
