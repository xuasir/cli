const fs = require('fs')
const path = require('path')

;(async () => {
  const templates = fs.readdirSync(path.join(__dirname, './src/template'))
  for (const t of templates) {
    const pkgPath = path.join(__dirname, './src/template', t, `package.json`)
    const pkg = require(pkgPath)
    pkg.devDependencies['@xus/cli'] =
      `^` + require('../cli/package.json').version
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
  }
})()
