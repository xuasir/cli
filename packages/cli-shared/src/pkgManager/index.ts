export const getPkgManager = () =>
  /yarn/.test(process.env?.npm_execpath || '') ? 'yarn' : 'npm'
