import { defineConfig } from '@xus/cli'
import vuejsx from '@xus/plugin-lib-vue-jsx'

export default defineConfig({
  plugins: [vuejsx()],
  libBuild: {
    target: ['es2015'],
    formats: ['esm'],
    sourcemap: false,
    minify: false
  }
})
