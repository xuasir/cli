import { defineConfig } from '@xus/cli'

export default defineConfig({
  libBuild: {
    target: 'esnext',
    formats: ['esm', 'cjs'],
    minify: false,
    sourcemap: false,
    alwaysEmptyDistDir: true,
    lerna: {
      pkgsOrder: [],
      excludePkgs: ['playground']
    }
  },
  lint: {
    eslint: {
      include: 'packages/**/src/**/*',
      ext: ['.ts']
    },
    stylelint: false
  },
  release: {
    beforeRelease: [
      {
        bin: 'npm',
        args: ['run', 'test'],
        message: {
          start: 'Test start',
          succeed: 'Test succeed',
          failed: 'Test failed'
        }
      },
      {
        bin: 'npm',
        args: ['run', 'lint-fix'],
        message: {
          start: 'Lint start',
          succeed: 'Lint succeed',
          failed: 'Lint failed'
        }
      },
      {
        bin: 'npm',
        args: ['run', 'build'],
        message: {
          start: 'Build start',
          succeed: 'Build succeed',
          failed: 'Build failed'
        }
      }
    ],
    branch: 'main'
  }
})
