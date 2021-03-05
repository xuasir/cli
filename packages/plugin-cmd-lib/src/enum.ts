export enum BuiltInRollupPlugin {
  Commonjs = 'commonjs',
  NodeResolve = 'nodeResolve',
  Typescript = 'typescript',
  Babel = 'babel',
  Vue = 'vue',
  Postcss = 'postcss',
  Alias = 'alias',
  Replace = 'replace',
  Svgr = 'svgr',
  Url = 'url',
  Json = 'json',
  Terser = 'terser',
  Dts = 'dts'
}

export const ExternalMatchBabelReg = new RegExp(/^@babel\/runtime/)
