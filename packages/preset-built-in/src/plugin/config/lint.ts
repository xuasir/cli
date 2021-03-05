import { createSchema } from '@xus/cli'

export type ILintConfig = {
  eslint:
    | boolean
    | {
        include?: string
        ext?: string[]
      }
  stylelint:
    | boolean
    | {
        include?: string[]
      }
}

export const lintSchema = createSchema<ILintConfig>((joi) => {
  return joi.object({
    eslint: [
      joi.object({
        include: joi.string(),
        ext: joi.array().items(joi.string())
      }),
      joi.boolean()
    ],
    stylelint: [
      joi.object({
        include: joi.array().items(joi.string())
      }),
      joi.boolean()
    ]
  })
})

export function defaultLitConfig(): ILintConfig {
  return {
    eslint: {
      include: '**/src/**/*',
      ext: []
    },
    stylelint: {
      include: []
    }
  }
}
