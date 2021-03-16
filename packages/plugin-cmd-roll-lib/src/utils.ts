import { createHash } from 'crypto'

export const queryRE = /\?.*$/
export const hashRE = /#.*$/

export const cleanUrl = (url: string) =>
  url.replace(hashRE, '').replace(queryRE, '')

export function createAssestHash(content: Buffer) {
  return createHash('sha256').update(content).digest('hex').slice(0, 8)
}
