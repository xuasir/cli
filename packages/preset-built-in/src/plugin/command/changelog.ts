import type { IPluginAPI } from '@xus/cli'
import { createPlugin, Spinner } from '@xus/cli'
import conventionalChangelog from 'conventional-changelog'
import { changelogSchema, defaultChangelogConfig } from '../config/changelog'
import { createWriteStream, readFileSync } from 'fs'
import { isAbsolute, join } from 'path'

export default createPlugin({
  name: 'cmd:changelog',
  apply(api) {
    api.registerCommand(
      'changelog',
      {
        desc: 'a command for generate changelog',
        usage: `xus changelog`
      },
      async () => {
        // handle of config
        const changelogConfig = api.projectConfig.changelog
        api.logger.debug(`changelog config `)
        api.logger.debug(api.projectConfig)
        await changelog(api, changelogConfig)
      }
    )
  },
  config: {
    key: 'changelog',
    default: defaultChangelogConfig,
    schema: changelogSchema
  }
})

type IOps = {
  filename: string
  mainTemplate: string
  headerPartial: string
  commitPartial: string
}

function changelog(api: IPluginAPI, ops: IOps) {
  const spinner = new Spinner()
  return new Promise((resolve, reject) => {
    spinner.start(`Generating changelog...`)
    conventionalChangelog(
      {
        preset: 'angular'
      },
      undefined,
      undefined,
      undefined,
      {
        mainTemplate: readFileSync(ensurePath(ops.mainTemplate), 'utf-8'),
        headerPartial: readFileSync(ensurePath(ops.headerPartial), 'utf-8'),
        commitPartial: readFileSync(ensurePath(ops.commitPartial), 'utf-8'),
        transform
      }
    )
      .pipe(createWriteStream(ops.filename))
      .on('close', () => {
        spinner.succeed(`changelog generated`)
        resolve(true)
      })
      .on('error', (err) => {
        spinner.failed(`changelog generate failed`)
        api.logger.error(err.message)
        reject(false)
      })
  })
}

function ensurePath(path: string) {
  return isAbsolute(path) ? path : join(process.cwd(), path)
}

function formatType(type: string) {
  const MAP: Record<string, string> = {
    fix: 'Bug Fixes',
    feat: 'Feature',
    docs: 'Document',
    types: 'Types',
    perf: 'optimization'
  }

  return MAP[type] || type
}

// fix|feat|docs|perf|test|types|style|build|chore|refactor|ci|wip|breaking change|release
const useless = [
  'chore',
  'test',
  'style',
  'build',
  'types',
  'ci',
  'wip',
  'release'
]

function transform(item: any) {
  if (useless.includes(item.type)) {
    return null
  }

  item.type = formatType(item.type)

  if (item.hash) {
    item.shortHash = item.hash.slice(0, 6)
  }

  if (item.references.length) {
    item.references.forEach((ref: any) => {
      if (ref.issue && item.subject) {
        item.subject = item.subject.replace(` (#${ref.issue})`, '')
      }
    })
  }
  return item
}
