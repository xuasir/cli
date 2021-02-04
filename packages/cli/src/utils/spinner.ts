import ora from 'ora'
import chalk from 'chalk'

type LastMsg = { symbol: string; text: string } | null

const spinner = ora()
let lastMsg: LastMsg = null

export const logWithSpinner = (symbol: string, msg?: string) => {
  if (!msg) {
    msg = symbol
    symbol = chalk.green('✔')
  }
  if (lastMsg) {
    spinner.stop()
  }
  spinner.text = ' ' + msg
  lastMsg = {
    symbol: symbol + ' ',
    text: msg
  }
  spinner.start()
}
export const stopSpinner = () => {
  if (!spinner.isSpinning) {
    return
  }
  if (lastMsg) {
    spinner.stop()
  }
  lastMsg = null
}
