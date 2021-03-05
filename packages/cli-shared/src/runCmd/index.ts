import execa from 'execa'
import { Spinner } from '../spinner'
import { Logger } from '../logger'

export type IRunCmdMessage = {
  start: string
  succeed: string
  failed: string
}

const logger = new Logger(`xus:shared:runCmd`)

export function runCmd(
  cmd: string,
  args: string[],
  message: IRunCmdMessage,
  options?: execa.Options
): Promise<boolean> {
  const spinner = new Spinner()
  spinner.start(message.start)
  return new Promise((resolve, reject) => {
    execa(cmd, args, options)
      .then(() => {
        spinner.succeed(message.succeed)
        resolve(true)
      })
      .catch((err) => {
        spinner.failed(message.failed)
        logger.error(err)
        reject(false)
      })
  })
}
