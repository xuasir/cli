type LoggerType = 'warn' | 'error' | 'info'

function logger(type: LoggerType = 'info') {
  return function (msg: string): void {
    console[type](msg)
  }
}

export function warn(msg: string): void {
  logger('warn')(`
    [xus-cli Warning]: ${msg}
  `)
}

export function error(msg: string): void {
  logger('error')(`
    [xus-cli error]: ${msg}
  `)
}

export function info(msg: string): void {
  logger('info')(`
    [xus-cli info]: ${msg}
  `)
}
