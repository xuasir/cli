// ;['shared', 'core', 'cli']
// ['cli','core','shared','preset'] --> ['shared', 'core', 'cli', 'preset']

export function orderBy(target: string[], by: string[]) {
  if (by.length < 1) return target
  const indexMap = by
    .map((by) => target.findIndex((val) => val === by))
    .filter((v) => v > -1)
  const pre = indexMap.map((i) => target[i])
  const post = target.filter((_, i) => !indexMap.includes(i))
  return [...pre, ...post]
}
