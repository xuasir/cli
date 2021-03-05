import { rimraf } from '../rimraf'

export function removeDirOrFile(dirOrFile: string[]) {
  return Promise.all(dirOrFile.map(async (p) => await rimraf(p)))
}
