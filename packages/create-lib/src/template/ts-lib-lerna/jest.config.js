const path = require('path')

module.exports = {
  preset: 'ts-jest',
  rootDir: __dirname,
  collectCoverage: true,
  collectCoverageFrom: ['packages/**/src/**/**.ts'],
  coverageDirectory: path.resolve(__dirname, 'coverage'),
  coverageReporters: ['html', 'text'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  watchPathIgnorePatterns: ['node_modules'],
  testMatch: ['packages/**/__test__/**/*spec.[jt]s?(x)']
}
