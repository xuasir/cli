import type { ILibBuildTargets } from '@xus/cli'

export const getModifyConfigCtx = (target: ILibBuildTargets) => {
  const ctx = {
    esm: false,
    cjs: false,
    browser: false,
    modern: false
  }
  ctx[target] = true
  return ctx
}

export const normalizeRollupConfig = () => {
  //
}
