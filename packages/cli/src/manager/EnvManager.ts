import type { Mode } from '../types'
import type { IPathManager } from './PathManager'
import { createEnvName } from '../utils'

class EnvManager {
  // path for load env file ??
  private PathManager: IPathManager

  constructor(pathManager: IPathManager) {
    this.PathManager = pathManager
  }

  get mode(): Mode {
    return (process.env.XUS_CLI_MODE ||
      process.env.NODE_ENV ||
      'development') as Mode
  }

  set mode(val: Mode) {
    process.env.XUS_CLI_MODE = val
    process.env.NODE_ENV = val
  }

  get babelEnv() {
    return process.env?.BABEL_ENV
  }

  set babelEnv(val: string | undefined) {
    process.env.BABEL_ENV = val
  }

  // for plugin
  getEnv(envName: string): string | null {
    return process.env[createEnvName(envName)] || null
  }

  setEnv(name: string, value: string): void {
    process.env[createEnvName(name)] = value
  }
}

export type IEnvManager = InstanceType<typeof EnvManager>

export default EnvManager
