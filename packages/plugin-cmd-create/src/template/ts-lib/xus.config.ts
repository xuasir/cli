import { defineConfig } from '@xus/cli'

export default defineConfig({
  libBuild: {
    targets: ['esm', 'cjs', 'browser']
  }
})
