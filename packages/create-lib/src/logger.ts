import chalk from 'chalk'

const INFO = chalk.black.bgBlue(' INFO ')
const WARN = chalk.black.bgHex('#faad14')(' WARN ')
const ERROR = chalk.black.bgRed(' ERROR ')
const SUCCESS = chalk.black.bgGreen(' SUCCESS ')

export const info = (msg: string) => {
  console.log(INFO, msg)
}
export const wran = (msg: string) => {
  console.log(WARN, msg)
}
export const error = (msg: string) => {
  console.log(ERROR, msg)
}
export const success = (msg: string) => {
  console.log(SUCCESS, msg)
}
