"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cli {
    constructor(ctxPath) {
        this.ctxPath = process.cwd();
        this.ctxPath = ctxPath;
    }
    async run(commandName, args, rawArgs) {
        console.log(`command `, commandName);
        console.log(`args `, args);
        console.log(`rawArgs `, rawArgs);
        // 1. valid commandName (help)
        // 2. init cli (load plugin / config...)
        // 3. get compiler task run
    }
}
exports.default = Cli;
