import { createPreset } from '@xus/cli'
// plugins
import commandHelp from '@xus/plugin-command-help'
import commitlint from '@xus/plugin-command-commit-lint'

export default createPreset({
  plugins: [commandHelp, commitlint]
})
