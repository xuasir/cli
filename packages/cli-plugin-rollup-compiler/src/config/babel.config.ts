export default {
  env: {
    'esm-bundler': {
      presets: [
        [
          '@xus/babel-preset',
          {
            useESModules: true,
            absoluteRuntime: false,
            useDynamicImport: false
          }
        ]
      ]
    },
    'esm-browser': {
      presets: [
        [
          '@xus/babel-preset',
          {
            useESModules: true,
            useTransformRuntime: false,
            useDynamicImport: false
          }
        ]
      ]
    },
    global: {
      presets: [
        [
          '@xus/babel-preset',
          {
            useTransformRuntime: false,
            useDynamicImport: true,
            modules: 'umd'
          }
        ]
      ]
    },
    node: {
      presets: [
        [
          '@xus/babel-preset',
          {
            targets: { node: 'current' },
            absoluteRuntime: false,
            useDynamicImport: true
          }
        ]
      ]
    }
  }
}
