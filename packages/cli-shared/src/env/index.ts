const EnvPrefix = `XUS_CLI`

export function createEnvNameWithXusPrefix(name: string): string {
  return `${EnvPrefix}_${name}`
}
