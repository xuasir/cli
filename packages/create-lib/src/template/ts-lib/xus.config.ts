import { defineConfig } from '@xus/cli'

export default defineConfig({
  libBuild: {
    targets: ['esm', 'cjs', 'browser'],
    rollTypes: true
  },
  lint: {
    eslint: {
      include: './src/**/*',
      ext: ['.ts']
    },
    stylelint: false
  },
  release: {
    beforeRelease: [],
    branch: 'main'
  }
})
