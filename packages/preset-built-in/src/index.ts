import { createPreset } from '@xus/cli'
// plugins
import commandHelp from '@xus/plugin-command-help'
import commitlint from '@xus/plugin-command-commit-lint'
import buildLib from '@xus/plugin-build-lib'
import bundlerRollup from '@xus/plugin-bundler-rollup'

export default createPreset({
  plugins: [commandHelp, commitlint, buildLib, bundlerRollup]
})
