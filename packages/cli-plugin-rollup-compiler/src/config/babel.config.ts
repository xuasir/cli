type Preset =
  | '@xus/babel-preset'
  | '@xus/babel-preset/lib/react'
  | '@xus/babel-preset/lib/vue'

export default (preset: Preset) => ({
  exclude: 'node_modules/**',
  env: {
    'esm-bundler': {
      presets: [
        [
          preset,
          {
            useESModules: true,
            absoluteRuntime: false
          }
        ]
      ]
    },
    'esm-browser': {
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
    },
    global: {
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
    },
    node: {
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
  }
})
