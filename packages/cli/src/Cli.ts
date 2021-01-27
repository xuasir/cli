class Cli {
  ctxPath: string = process.cwd()
  constructor(ctxPath: string) {
    this.ctxPath = ctxPath
  }
  async run(
    commandName: string,
    args: { [key: string]: any },
    rawArgs: any[]
  ): Promise<any> {
    console.log(`command `, commandName)
    console.log(`args `, args)
    console.log(`rawArgs `, rawArgs)
    // 1. valid commandName (help)
    // 2. init cli (load plugin / config...)
    // 3. get compiler task run
  }
}

export default Cli
