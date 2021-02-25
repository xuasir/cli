import type { IModifyRollupConfigCtx } from '@xus/cli'

export default (ctx: IModifyRollupConfigCtx, isVue = false) => {
  const preset = isVue
    ? require('@xus/babel-preset/lib/vue')
    : require('@xus/babel-preset/lib/react')
  if (ctx.esm) {
    return {
      presets: [
        [
          preset,
          {
            useESModules: true,
            absoluteRuntime: false
          }
        ]
      ]
    }
  } else if (ctx.modern) {
    return {
      presets: [
        [
          preset,
          {
            usageMode: true,
            useESModules: true,
            useTransformRuntime: false
          }
        ]
      ]
    }
  } else if (ctx.cjs) {
    return {
      presets: [
        [
          preset,
          {
            targets: { node: 'current' },
            absoluteRuntime: false,
            useDynamicImport: true
          }
        ]
      ]
    }
  } else {
    return {
      presets: [
        [
          preset,
          {
            usageMode: true,
            useTransformRuntime: false,
            useDynamicImport: true
          }
        ]
      ]
    }
  }
}
