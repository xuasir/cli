import { createTemp } from './create'
import yParser from 'yargs-parser'
const args = yParser(process.argv.slice(2))

async function main() {
  await createTemp(args)
}

main().catch((e) => {
  console.log(e)
  process.exit(1)
})
