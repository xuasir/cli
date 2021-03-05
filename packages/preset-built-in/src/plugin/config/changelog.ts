import { createSchema } from '@xus/cli'
import { join } from 'path'

export type IChangelogConfig = {
  filename: string
  mainTemplate: string
  headerPartial: string
  commitPartial: string
}

export const changelogSchema = createSchema<IChangelogConfig>((joi) => {
  return joi.object({
    filename: joi.string(),
    mainTemplate: joi.string(),
    headerPartial: joi.string(),
    commitPartial: joi.string()
  })
})

export function defaultChangelogConfig(): IChangelogConfig {
  return {
    filename: 'CHANGELOG.md',
    mainTemplate: join(__dirname, '../template/changelog-main.hbs'),
    headerPartial: join(__dirname, '../template/changelog-header.hbs'),
    commitPartial: join(__dirname, '../template/changelog-commit.hbs')
  }
}
