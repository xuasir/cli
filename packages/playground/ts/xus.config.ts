import { defineConfig } from '@xus/cli'

export default defineConfig({
  libBuild: {
    target: ['es2015'],
    formats: ['esm'],
    sourcemap: false,
    minify: false,
    rollTypes: true,
    rollupChain(rc) {
      rc.input({
        index: './src/index.ts',
        di: './src/di.ts'
      })
      return rc
    },
    alwaysEmptyDistDir: true
  }
})
