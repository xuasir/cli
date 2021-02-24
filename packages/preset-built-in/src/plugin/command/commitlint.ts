import { createPlugin, chalk } from '@xus/cli'
import { readFileSync } from 'fs-extra'

// const
const HuskyGitParamsEnv = 'HUSKY_GIT_PARAMS'
const GitParamsEnv = 'GIT_PARAMS'
const commitRE = /^(revert: )?(fix|feat|docs|perf|test|types|style|build|chore|refactor|ci|wip|breaking change)(\(.+\))?: .{1,50}/
const mergeRE = /Merge /

export default createPlugin({
  name: 'cmd:commitlint',
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

        api.logger.debug(`git message path: `)
        api.logger.debug(gitMsgPath)
        api.logger.debug(`husky message path: `)
        api.logger.debug(huskyMsgPath)

        const msgPath = gitMsgPath || huskyMsgPath
        if (msgPath) {
          const commitMsg = readFileSync(msgPath, 'utf-8').trim()

          api.logger.debug(`commit message content: `)
          api.logger.debug(commitMsg)

          if (!commitRE.test(commitMsg) && !mergeRE.test(commitMsg)) {
            api.logger.error(`invalid commit message: "${chalk.red(
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
        api.logger.wran(chalk.red(`no HUSKY_GIT_PARAMS`))
        process.exit(1)
      }
    )
  }
})
