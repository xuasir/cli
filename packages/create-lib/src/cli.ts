#!/usr/bin/env node

import { createTemp } from './create'
import { yParser } from '@xus/cli'
const rawArgs = process.argv.slice(2)
const args = yParser(rawArgs)

async function main() {
  await createTemp(args)
}

main().catch((e) => {
  console.log(e)
  process.exit(1)
})
