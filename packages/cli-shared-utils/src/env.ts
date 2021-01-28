const EnvPrefix = `XUS_CLI`

export function createEnvName(name: string): string {
  return `${EnvPrefix}_${name}`
}
