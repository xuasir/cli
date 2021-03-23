import { defineConfig } from '@xus/cli'

export default defineConfig({
  libBuild: {
    target: 'node12',
    formats: ['cjs'],
    minify: false,
    alwaysEmptyDistDir: true,
    rollTypes: true,
    sourcemap: false,
    disableFormatPostfix: true,
    rollupChain(rc, pkgDir) {
      if (pkgDir === 'cli') {
        rc.input({
          index: './src/index.ts',
          xus: './src/xus.ts'
        })
      }
      return rc
    },
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
    },
    afterBuild: [
      {
        bin: 'yarn',
        args: ['copy:preset'],
        message: {
          start: 'copy preset template start',
          failed: 'copy preset template failed',
          succeed: 'copy preset template succeed'
        }
      },
      {
        bin: 'yarn',
        args: ['copy:create'],
        message: {
          start: 'copy create-lib template start',
          failed: 'copy create-lib template failed',
          succeed: 'copy create-lib template succeed'
        }
      }
    ]
  },
  release: {
    branch: 'main'
  },
  lint: {
    eslint: {
      ext: ['.ts']
    }
  }
})
