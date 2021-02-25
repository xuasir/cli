import { createPreset } from '@xus/cli'
// lib bundler plugins
import buildLib from '@xus/plugin-build-lib'
import bundlerRollup from '@xus/plugin-bundler-rollup'
import cmdLib from '@xus/plugin-cmd-lib'
// cmd
import commandHelp from './plugin/command/help'
import cmdCommitlint from './plugin/command/commitlint'
import cmdClean from './plugin/command/clean'

export default createPreset({
  plugins: [
    buildLib,
    bundlerRollup,
    cmdLib,
    commandHelp,
    cmdCommitlint,
    cmdClean
  ]
})
