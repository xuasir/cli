import { compatESModuleRequire } from '../compatESModuleRequire'

export function loadModule<T = any>(
  modulePath: string,
  onError: (error: any) => void
): T {
  let moduleContent
  try {
    moduleContent = require(modulePath)
  } catch (err) {
    onError && onError(err)
  }

  return compatESModuleRequire(moduleContent)
}
