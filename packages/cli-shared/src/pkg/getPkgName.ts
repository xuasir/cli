import { lookUpFile } from '../file'

export const getPkgName = (root: string) => {
  const { name } = JSON.parse(lookUpFile(root, ['package.json']) || `{}`)

  if (!name) throw new Error('no name found in package.json')

  return name.startsWith('@') ? name.split('/')[1] : name
}
