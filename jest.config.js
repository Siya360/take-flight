// jest.config.js
module.exports = {
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    collectCoverageFrom: [
      'server/**/*.js',
      '!server/node_modules/**',
      '!server/coverage/**',
      '!server/tests/**',
    ],
    moduleFileExtensions: ['js', 'json'],
    testMatch: ['**/tests/**/*.test.js'],
    testPathIgnorePatterns: ['/node_modules/'],
    setupFilesAfterEnv: ['./jest.setup.js'],
  }