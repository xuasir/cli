import { createSchema } from '@xus/cli-shared'

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
    mainTemplate: './template/changelog-main.hbs?url',
    headerPartial: './template/changelog-header.hbs?url',
    commitPartial: './template/changelog-commit.hbs?url'
  }
}
