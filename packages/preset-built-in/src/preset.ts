import { createPreset } from '@xus/cli-types'
// cmd
import cmdHelp from './plugin/command/help'
import cmdCommitlint from './plugin/command/commitlint'
import cmdClean from './plugin/command/clean'
import cmdCopy from './plugin/command/copy'
import cmdLint from './plugin/command/lint'
import cmdRelease from './plugin/command/release'
import cmdChangelog from './plugin/command/changelog'
//bundler
import bundler from './plugin/bundler'
// lib build process plugins
import cmdRoll from '@xus/plugin-cmd-roll-lib'

export default createPreset({
  plugins: [
    bundler,
    cmdHelp,
    cmdCommitlint,
    cmdClean,
    cmdCopy,
    cmdLint,
    cmdRelease,
    cmdChangelog,
    cmdRoll
  ]
})
