import { defineConfig } from '@xus/cli'

export default defineConfig({
  libBuild: {
    target: ['es2015'],
    formats: ['esm'],
    sourcemap: false,
    minify: false
  }
})
