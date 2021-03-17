// es6+
export const trim = '   123'.trimStart()
export const arrFalt = [['1', '2'], 3].falt()

// dynamic import
export const di = async () => {
  await Promise.resolve(3)
  await import('./di')
}
