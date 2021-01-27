#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimist_1 = __importDefault(require("minimist"));
const Cli_1 = __importDefault(require("./Cli"));
// collect builtIn plugins
// const plugins = []
// 1. init cli
const cli = new Cli_1.default(process.env.XUS_BUNDLE_CONTEXT || process.cwd());
// 2. get args
const rawArgs = process.argv.slice(2);
const args = minimist_1.default(rawArgs);
const commandName = args._[0];
// 3. run commander
cli.run(commandName, args, rawArgs).catch(() => {
    process.exit(1);
});
