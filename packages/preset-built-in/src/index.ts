import presetBuiltIn from './preset'
export default presetBuiltIn

// types
export type { ILintConfig } from './plugin/config/lint'
export type { IChangelogConfig } from './plugin/config/changelog'
export type { IReleaseConfig } from './plugin/config/release'

// export
export * from '@xus/plugin-build-lib'
export * from '@xus/plugin-cmd-lib'
