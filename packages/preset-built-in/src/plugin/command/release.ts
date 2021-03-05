import type { IPluginAPI } from '@xus/cli'
import {
  createPlugin,
  isLernaPkg,
  semver,
  prompt,
  orderBy,
  runCmd,
  chalk
} from '@xus/cli'
import { join, relative } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import {
  releaseSchema,
  defaultReleaseConfig,
  IReleaseConfig
} from '../config/release'

export default createPlugin({
  name: 'cmd:release',
  apply(api) {
    api.registerCommand(
      'release',
      {
        desc: 'a command for release package',
        usage: `xus release --tag pkgname@1.1.1`,
        options: {
          '--tag': 'point release tag'
        }
      },
      async (args) => {
        const isLerna = isLernaPkg(api.cwd)
        const releaseConfig = api.projectConfig.release
        // options
        const ops = {
          isLerna,
          api,
          packageRoot: api.getPathBasedOnCtx('packages'),
          tag: args?.tag,
          ...releaseConfig
        }
        if (isLerna) {
          const pkgs = api.getLernaPkgs()
          await release(pkgs, ops)
        } else {
          await release([api.cwd], ops)
        }
      }
    )
  },
  config: {
    key: 'release',
    default: defaultReleaseConfig,
    schema: releaseSchema
  }
})

// types
type IReleaseOps = {
  api: IPluginAPI
  isLerna: boolean
  packageRoot: string
  order: string[]
  tag?: string
} & {
  [key in keyof IReleaseConfig]: IReleaseConfig[key]
}

type IPkg = {
  name: string
  version: string
  private?: boolean
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  [key: string]: any
}

// constants
const versionIncrements = [
  'patch',
  'minor',
  'major',
  'prepatch',
  'preminor',
  'premajor',
  'prerelease'
]

const inc = (curVersion: string, i: semver.ReleaseType) =>
  semver.inc(curVersion, i)

const stepColor = (msg: string) => chalk.cyan(msg)

let pkgdir2version: Record<string, string> = {}
let pkgname2pkgdir: Record<string, string> = {}
let pkgdir2pkgname: Record<string, string> = {}
function getversionByPkgname(pkgName: string) {
  return pkgdir2version[pkgname2pkgdir[pkgName]]
}

async function release(pkgs: string[], ops: IReleaseOps) {
  pkgdir2version = {}
  pkgname2pkgdir = {}
  pkgdir2pkgname = {}
  ops.api.logger.debug(`ensure version `)
  for (const pkg of pkgs) {
    await ensureVersion(pkg, ops)
  }
  ops.api.logger.debug(pkgdir2version)

  // order pkgs for publish
  ops.api.logger.debug(`order target pkg by ${ops.order}`)
  const targets = orderBy(Object.keys(pkgdir2version), ops.order)
  ops.api.logger.debug(targets)

  // publish
  await publish(targets, ops)
}

async function ensureVersion(pkgRoot: string, ops: IReleaseOps) {
  const pkgJsonPath = join(pkgRoot, 'package.json')
  if (!existsSync(pkgJsonPath)) return
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkgJson: IPkg = require(pkgJsonPath)

  if (pkgJson?.private) return

  const curVersion = pkgJson.version
  let targetVersion = ''

  const { release } = await prompt<{ release: string }>({
    type: 'select',
    name: 'release',
    message: `Select ${pkgJson.name} release version`,
    choices: versionIncrements
      .map((i) => `${i} (${inc(curVersion, i as semver.ReleaseType)})`)
      .concat(['custom', 'skip'])
  })
  if (release === 'skip') return
  if (release === 'custom') {
    targetVersion = (
      await prompt<{ version: string }>({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: curVersion
      })
    ).version
  } else {
    targetVersion = release.match(/\((.*)\)/)![1]
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`version: ${targetVersion} is invalid!`)
  }
  const pkgdir = ops.isLerna
    ? relative(ops.packageRoot, pkgRoot)
    : '../packages'
  pkgdir2version[pkgdir] = targetVersion
  pkgname2pkgdir[pkgJson.name] = pkgdir
  pkgdir2pkgname[pkgdir] = pkgJson.name
}

async function publish(targets: string[], ops: IReleaseOps) {
  if (targets.length > 0) {
    const logger = ops.api.logger
    // 1. before publish run cmd
    logger.debug(`run before publish cmd`)
    const beforeRun = await ops.beforeRelease.reduce((p, cmd) => {
      return p.then(() => runCmd(cmd.bin, cmd.args, cmd.message))
    }, Promise.resolve(true))
    if (!beforeRun) return
    logger.debug(`run before publish cmd succeed`)

    // 2. update version
    logger.info(stepColor(`Update version info...`))
    updateVersion(ops)

    // 3. generate changelog
    // 4. commit changes
    const runRes = await [
      {
        bin: 'npx',
        args: ['xus', 'changelog'],
        message: {
          start: 'generate changelog start',
          succeed: 'generate changelog succeed',
          failed: 'generate changelog failed'
        }
      },
      {
        bin: 'git',
        args: ['add', '-A'],
        message: {
          start: 'add changes start',
          succeed: 'add changes succeed',
          failed: 'add changes failed'
        }
      },
      {
        bin: 'git',
        args: [
          'commit',
          '-m',
          'release: publish packages:\n' +
            Object.keys(pkgname2pkgdir).reduce(
              (res, pkgname) =>
                res + pkgname + '@' + getversionByPkgname(pkgname) + '\n',
              ''
            ),
          '--no-verify'
        ],
        message: {
          start: 'commit changes start',
          succeed: 'commit changes succeed',
          failed: 'commit changes failed'
        }
      }
    ].reduce((p, cmd) => {
      return p.then(() => runCmd(cmd.bin, cmd.args, cmd.message))
    }, Promise.resolve(true))
    if (!runRes) return

    // 5. publish to npm
    logger.info(stepColor(`Publish to npm...`))
    for (const target of targets) {
      await workForPublish(target, ops)
    }

    // 6. push and tag
    logger.info(stepColor(`Push and Tag...`))
    const tag = ops?.tag || generateTag()
    await [
      {
        bin: 'git',
        args: ['tag', tag],
        message: {
          start: 'git tag start',
          succeed: 'git tag succeed',
          failed: 'git tag failed'
        }
      },
      {
        bin: 'git',
        args: ['push', 'origin', `refs/tags/${tag}`],
        message: {
          start: 'push tag start',
          succeed: 'push tag succeed',
          failed: 'push tag failed'
        }
      },
      {
        bin: 'git',
        args: ['push', 'origin', ops.branch],
        message: {
          start: 'push commit start',
          succeed: 'push commit succeed',
          failed: 'push commit failed'
        }
      }
    ].reduce((p, cmd) => {
      return p.then(() => runCmd(cmd.bin, cmd.args, cmd.message))
    }, Promise.resolve(true))
  }
}

function updateVersion(ops: IReleaseOps) {
  if (ops.isLerna) {
    ops.api
      .getLernaPkgs()
      .map((p) => relative(ops.packageRoot, p))
      .forEach((pkgDir) => updatePackage(pkgDir, ops))
  } else {
    updatePackage('../packages', ops)
  }
}

function updatePackage(pkgDir: string, ops: IReleaseOps) {
  const root = join(ops.packageRoot, pkgDir)
  const pkgPath = join(root, 'package.json')
  if (!existsSync(pkgPath)) return
  const pkgJson: IPkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
  if (pkgdir2version[pkgDir]) {
    pkgJson.version = pkgdir2version[pkgDir]
  }
  updateDeps(pkgJson, 'dependencies')
  updateDeps(pkgJson, 'devDependencies')
  updateDeps(pkgJson, 'peerDependencies')
  writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2))
}

function updateDeps(pkg: IPkg, key: string) {
  const dep = pkg[key]
  if (dep) {
    Object.keys(dep).forEach((pkg) => {
      if (pkgname2pkgdir[pkg]) {
        dep[pkg] = `^${getversionByPkgname(pkg)}`
      }
    })
  }
}

async function workForPublish(pkgDir: string, ops: IReleaseOps) {
  const root = join(ops.packageRoot, pkgDir)
  const pkgname = pkgdir2pkgname[pkgDir]
  const saveCwd = process.cwd()
  process.chdir(root)
  await runCmd('npm', ['publish', '--access', 'public'], {
    start: `publish ${pkgname} start`,
    succeed: `publish ${pkgname} succeed`,
    failed: `publish ${pkgname} failed`
  })
  process.chdir(saveCwd)
}

function generateTag() {
  return Object.keys(pkgname2pkgdir)
    .map((pkgname) => `${pkgname}@${getversionByPkgname(pkgname)}`)
    .join('|')
}
