import { createPreset } from '@xus/cli'
// plugins
import buildLib from '@xus/plugin-build-lib'
import bundlerRollup from '@xus/plugin-bundler-rollup'
// cmd
import commandHelp from './plugin/command/help'
import cmdCommitlint from './plugin/command/commitlint'
import cmdClean from './plugin/command/clean'

export default createPreset({
  plugins: [buildLib, bundlerRollup, commandHelp, cmdCommitlint, cmdClean]
})
