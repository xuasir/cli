import ora from 'ora'
import chalk from 'chalk'
import logSymbols from 'log-symbols'

type OraIns = ora.Ora | null

const spinner = ora()
let oraIns: OraIns = null

export const logWithSpinner = (msg: string) => {
  if (oraIns) {
    oraIns.stop()
  }
  spinner.text = chalk.yellow(' ' + msg)
  oraIns = spinner.start()
}

export const stopSpinner = () => {
  if (!oraIns) {
    return
  }
  oraIns.stop()
  oraIns = null
}

export const failSpinner = (text?: string) => {
  oraIns &&
    oraIns.stopAndPersist({
      symbol: logSymbols.error,
      text: chalk.red(text || oraIns.text)
    })
}

export const succeedSpinner = (text?: string) => {
  oraIns &&
    oraIns.stopAndPersist({
      symbol: logSymbols.success,
      text: chalk.green(text || oraIns.text)
    })
}
