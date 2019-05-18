module.exports = {
  preset: 'ts-jest',
  roots: [
    '<rootDir>/src'
  ],
  testEnvironment: 'node',
  moduleFileExtensions: [
    'ts',
    'js',
    'json'
  ],
  unmockedModulePathPatterns: [
    '/node_modules/'
  ],
  coveragePathIgnorePatterns: [
    'index.ts'
  ],
  collectCoverageFrom: [
    '**/*.ts'
  ],
  collectCoverage: true,
  coverageReporters: [
    'lcov',
    'json'
  ]
};