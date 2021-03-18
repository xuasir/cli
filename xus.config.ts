import { defineConfig } from './packages/cli/dist'

export default defineConfig({
  libBuild: {
    target: 'node12',
    formats: ['cjs'],
    minify: false,
    alwaysEmptyDistDir: true,
    rollTypes: true,
    sourcemap: false,
    lerna: {
      pkgsOrder: [
        'cli-shared',
        'core',
        'cli-types',
        'plugin-cmd-roll-lib',
        'preset-built-in',
        'cli'
      ],
      excludePkgs: ['playground', 'plugin-lib-vue']
    }
  },
  release: {
    branch: 'main'
  }
})
