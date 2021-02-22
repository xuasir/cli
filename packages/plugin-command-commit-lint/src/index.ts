import { createPlugin, chalk } from '@xus/cli'
import { HuskyGitParamsEnv, GitParamsEnv, commitRE, mergeRE } from './constants'
import { readFileSync } from 'fs-extra'

export default createPlugin({
  name: 'commandCommitlint',
  apply(api) {
    api.registerCommand(
      'commit-lint',
      {
        usage: 'xus commit-lint',
        desc: 'help you to validate commit message'
      },
      () => {
        const gitMsgPath = api.getEnv(GitParamsEnv)
        const huskyMsgPath = api.getEnv(HuskyGitParamsEnv)
        const msgPath = gitMsgPath || huskyMsgPath
        if (msgPath) {
          const commitMsg = readFileSync(msgPath, 'utf-8').trim()
          if (!commitRE.test(commitMsg) && !mergeRE.test(commitMsg)) {
            api.logger.info(`invalid commit message: "${chalk.red(
              commitMsg.replace(/# .*/, ' ')
            )}".
  
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
          return
        }
        api.logger.log(chalk.red(`no HUSKY_GIT_PARAMS`))
        process.exit(1)
      }
    )
  }
})
