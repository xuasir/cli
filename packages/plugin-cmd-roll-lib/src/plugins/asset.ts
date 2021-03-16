import { Logger } from '@xus/cli-shared'
import path from 'path'
import fs from 'fs'
import mime from 'mime/lite'
import { parse as parseUrl } from 'url'
import MagicString from 'magic-string'
import { cleanUrl, createAssestHash } from '../utils'
import { Plugin, PluginContext } from 'rollup'

interface IAssestOps {
  assetRoot?: string
  assetDir?: string
  inlineLimit?: number
}

const logger = new Logger(`xus:rollup:asset`)

const XUS_ASSET_PREFIX = `@assets`
// __XUS_ASSET_PROXY__{contentHash}__($_{postfix}_)
const AssetUrlQuotedRE = /"__XUS_ASSET_PROXY__([a-z\d]{8})__(?:\$_(.*?)__)?"/g

function toXusAssestUrl(contentHash: string, postfix?: string) {
  return `__XUS_ASSET_PROXY__${contentHash}__${postfix ? `$_${postfix}__` : ``}`
}

const KNOWN_ASSET_TYPES = [
  // images
  'png',
  'jpe?g',
  'gif',
  'svg',
  'ico',
  'webp',
  'avif',

  // media
  'mp4',
  'webm',
  'ogg',
  'mp3',
  'wav',
  'flac',
  'aac',

  // fonts
  'woff2?',
  'eot',
  'ttf',
  'otf'
]

const KnownAssetRE = new RegExp(
  `\\.(` + KNOWN_ASSET_TYPES.join('|') + `)(\\?.*)?$`
)

// ?raw special query mark asset keep raw and inline load
const rawRE = /(\?|&)raw(?:&|$)/
// ?url special query mark asset url load
const urlRE = /(\?|&)url(?:&|$)/

const AssestCache = new Map<string, string>()
const HashToFilenameCache = new Map<string, string>()

export function assetPlugin(ops?: IAssestOps): Plugin {
  const { assetRoot = 'assets' } = ops!
  return {
    name: 'xus:asset',
    resolveId(id) {
      // before node resolve??
      const cleanId = cleanUrl(id)
      if (KnownAssetRE.test(cleanId) && isExists(cleanId, assetRoot)) {
        return id
      }
      return null
    },
    load(id) {
      if (rawRE.test(id)) {
        logger.debug(`load raw assets: `, id)
        const url = getAbsoluteUrl(id, assetRoot)
        return `export default ${JSON.stringify(
          fs.readFileSync(cleanUrl(url), 'utf-8')
        )}`
      }
      if (KnownAssetRE.test(cleanUrl(id)) || urlRE.test(id)) {
        const idWithoutUrl = getAbsoluteUrl(id, assetRoot)
          .replace(urlRE, '$1')
          .replace(/[\\?&]$/, '')
        logger.debug(`load known asset: `, id)
        const url = loadFile(idWithoutUrl, ops!, this)
        return `export default ${JSON.stringify(url)}`
      }
      return null
    },
    renderChunk(code, chunk) {
      let match
      let s
      logger.debug(`render chunk source code: `)
      logger.debug(code)
      while ((match = AssetUrlQuotedRE.exec(code))) {
        s = s || new MagicString(code)
        const [full, hash, postfix = ''] = match
        // out file url
        const dirname = path.relative(
          path.dirname(path.join('./', chunk.fileName)),
          './'
        )
        const filename = path.join(
          dirname,
          HashToFilenameCache.get(hash) + postfix
        )
        s.overwrite(
          match.index,
          match.index + full.length,
          JSON.stringify(filename.startsWith('.') ? filename : './' + filename)
        )
      }
      if (s) {
        logger.debug(`after render asset to chunk: `)
        logger.debug(s.toString())
        return {
          code: s.toString(),
          map: s.generateMap({ hires: true })
        }
      }
      return null
    }
  }
}

function loadFile(id: string, ops: IAssestOps, ctx: PluginContext) {
  const cached = AssestCache.get(id)
  if (cached) return cached

  const cleanId = cleanUrl(id)
  const { search, hash } = parseUrl(id)
  const postfix = (search || '') + (hash || '')
  const content = fs.readFileSync(cleanId)

  const { inlineLimit, assetDir = 'assets' } = ops
  let url = ''
  if (content.length < Number(inlineLimit)) {
    // inline base64
    logger.debug(`${id} load to base64`)
    url = `data:${mime.getType(cleanId)};base64,${content.toString('base64')}`
    logger.debug(`asset to base64 ${url.slice(0, 100)}...`)
  } else {
    // use url
    logger.debug(`${id} load to url`)
    const contentHash = createAssestHash(content)
    if (!HashToFilenameCache.has(contentHash)) {
      // emit file
      const basename = path.basename(cleanId)
      const ext = path.extname(basename)
      const fileName = path.posix.join(
        assetDir,
        `${basename.slice(0, -ext.length)}.${contentHash}${ext}`
      )
      logger.debug(`render file ${id} --> ${fileName}`)
      HashToFilenameCache.set(contentHash, fileName)
      ctx.emitFile({
        fileName,
        type: 'asset',
        source: content
      })
    }
    url = toXusAssestUrl(contentHash, postfix)
    logger.debug(`asset to url proxy: `, url)
  }
  AssestCache.set(id, url)
  return url
}

function isExists(id: string, assetRoot: string) {
  const url = getAbsoluteUrl(id, assetRoot)
  return fs.existsSync(cleanUrl(url))
}

function getAbsoluteUrl(id: string, assetRoot: string) {
  let url = id
  if (id.startsWith(XUS_ASSET_PREFIX)) {
    url = id.replace(XUS_ASSET_PREFIX, assetRoot)
  }
  return url
}
