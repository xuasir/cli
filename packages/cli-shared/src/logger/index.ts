import chalk from 'chalk'
import { BaseLogger } from './base'

export class Logger extends BaseLogger {
  protected LOG = chalk.black.bgBlue(' LOG ')
  protected INFO = chalk.black.bgBlue(' INFO ')
  protected WARN = chalk.black.bgHex('#faad14')(' WARN ')
  protected ERROR = chalk.black.bgRed(' ERROR ')
  protected SUCCESS = chalk.black.bgGreen(' SUCCESS ')
  protected PROFILE = chalk.black.bgCyan(' PROFILE ')

  constructor(namespace: string) {
    super(namespace)
  }

  log(msg: string) {
    console.log(this.LOG, msg)
  }

  info(msg: string) {
    console.log(this.INFO, msg)
  }

  wran(msg: string) {
    console.warn(this.WARN, msg)
  }

  error(msg: string) {
    console.error(this.ERROR, msg)
  }

  success(msg: string) {
    console.log(this.SUCCESS, msg)
  }

  profiler(id: string, message?: string) {
    const time = Date.now()
    const namespace = `${this.namespace}:${id}`

    // for profiler test
    let msg
    if (this.profilers[id]) {
      const timeEnd = this.profilers[id]
      delete this.profilers[id]
      process.stderr.write(this.PROFILE + ' ')
      msg = `${this.PROFILE} ${chalk.cyan(
        `└ ${namespace}`
      )} Completed in ${this.formatTiming(time - timeEnd)}`
      console.log(msg)
    } else {
      msg = `${this.PROFILE} ${chalk.cyan(`┌ ${namespace}`)} ${message || ''}`
      console.log(msg)
    }

    this.profilers[id] = time
    return msg
  }
}
