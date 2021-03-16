import createDebug, { Debugger } from 'debug'

export abstract class BaseLogger {
  public debug: Debugger
  protected namespace: string
  protected profilers: Record<string, any> = {}
  protected formatTiming(timing: number) {
    return timing < 60 * 1000
      ? `${Math.round(timing / 10) / 100}s`
      : `${Math.round(timing / 600) / 100}m`
  }

  constructor(namespace: string) {
    if (!namespace) {
      throw new Error(`logger need namespace`)
    }
    this.namespace = namespace
    this.debug = createDebug(namespace)
  }

  abstract log(msg: string): void
  abstract warn(msg: string): void
  abstract error(msg: string): void
  abstract profiler(id: string, ...args: any[]): void
}
