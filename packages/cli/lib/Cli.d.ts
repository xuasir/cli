declare class Cli {
    ctxPath: string;
    constructor(ctxPath: string);
    run(commandName: string, args: {
        [key: string]: any;
    }, rawArgs: any[]): Promise<any>;
}
export default Cli;
