import type { IPluginAPI } from '@xus/cli'
import { HuskyGitParamsEnv, commitRE, mergeRE } from './constants'
import { readFileSync } from 'fs-extra'
import chalk from 'chalk'

export default function (api: IPluginAPI): void {
  api.registerCommand(
    'commit-lint',
    {
      usage: 'xus commit-lint',
      desc: 'help you to validate commit message'
    },
    () => {
      const gitParams = api.EnvManager.getEnv(HuskyGitParamsEnv)
      if (gitParams) {
        const commitMsg = readFileSync(gitParams, 'utf-8').trim()
        if (!commitRE.test(commitMsg) && !mergeRE.test(commitMsg)) {
          console.info(`invalid commit message: 
  "${chalk.red(commitMsg)}".

Proper commit message format is required for automated changelog generation.
        
Examples: 
        
- fix(Button): incorrect style
- feat(Button): incorrect style
- docs(Button): fix typo
        
Allowed Types:
        
- fix (修复bug)
- feat (新特性)
- docs (文档相关)
- perf (性能优化)
- test (测试相关)
- types (ts类型相关)
- build (打包构建相关)
- chore (其他类型)
- ci (CI/CD相关)
- wip (开发中间态)
- refactor (代码重构)
- breaking change (重大变更)
- Merge branch 'foo' into 'bar' (分支合并)
        `)
          process.exit(1)
        }
      }
      console.log(chalk.red(`no HUSKY_GIT_PARAMS`))
      process.exit(1)
    }
  )
}
