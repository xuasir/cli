import type { ICliService } from '../cli/Service'
import { createEnvNameWithXusPrefix } from '@xus/cli-shared'

type IEnvManagerOps = {
  mode: string
  service: ICliService
}

export class EnvManager {
  // TODO: path for load .env file
  private service: ICliService

  constructor(ops: IEnvManagerOps) {
    this.mode = ops.mode
    this.service = ops.service
  }

  get mode() {
    return process.env.XUS_CLI_MODE || process.env.NODE_ENV || 'development'
  }
  set mode(val: string) {
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
    return process.env[envName] || null
  }

  setEnv(name: string, value: string): void {
    process.env[name] = value
  }

  getCliEnv(envName: string): string | null {
    return process.env[createEnvNameWithXusPrefix(envName)] || null
  }

  setCliEnv(name: string, value: string): void {
    process.env[createEnvNameWithXusPrefix(name)] = value
  }
}

export type IEnvManager = InstanceType<typeof EnvManager>
