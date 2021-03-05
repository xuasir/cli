import { createPreset } from '@xus/cli'
// lib build process plugins
import buildLib from '@xus/plugin-build-lib'
import cmdLib from '@xus/plugin-cmd-lib'
// cmd
import cmdHelp from './plugin/command/help'
import cmdCommitlint from './plugin/command/commitlint'
import cmdClean from './plugin/command/clean'
import cmdCopy from './plugin/command/copy'
import cmdLint from './plugin/command/lint'
import cmdRelease from './plugin/command/release'
import cmdChangelog from './plugin/command/changelog'

export default createPreset({
  plugins: [
    buildLib,
    cmdHelp,
    cmdCommitlint,
    cmdClean,
    cmdCopy,
    cmdLint,
    cmdRelease,
    cmdChangelog,
    cmdLib
  ]
})
